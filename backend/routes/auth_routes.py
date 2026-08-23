import datetime
import re
from flask import Blueprint, request, jsonify
import jwt

from database import db, LOCAL_USERS, LOCAL_REGISTRATIONS, ADMIN_USERNAME, ADMIN_PASSWORD
from auth import JWT_SECRET

auth_bp = Blueprint('auth', __name__)


def _safe_regex(user_input):
    """Escape user input for safe use in MongoDB $regex queries."""
    return re.escape(user_input)


# 1. Participant Login Endpoint (Email/Phone + Submission ID/Roll No)
@auth_bp.route("/api/auth/login", methods=["POST"])
def participant_login():
    try:
        data = request.get_json() or {}
        input_val = (data.get("email") or data.get("emailId") or "").strip()
        key = (data.get("submissionId") or data.get("regNo") or "").strip()

        if not input_val or not key:
            return jsonify({"error": "Please provide both Email/Phone AND Submission ID/Roll No."}), 400

        regs = []

        if db is not None:
            user_doc = None
            
            safe_input = _safe_regex(input_val)
            input_rx = {"$regex": f"^{safe_input}$", "$options": "i"}
            safe_key = _safe_regex(key)
            key_rx = {"$regex": f"^{safe_key}$", "$options": "i"}

            # First, check if key is a submissionId
            reg = db.registrations.find_one({"submissionId": key_rx})
            if reg and "userId" in reg:
                # verify user matches input_val (email/phone)
                user_doc = db.users.find_one({
                    "_id": reg["userId"],
                    "$or": [{"emailId": input_rx}, {"collegeEmailId": input_rx}, {"phoneNumber": input_rx}]
                })
            
            # If not found via submissionId, try key as regNo
            if not user_doc:
                user_doc = db.users.find_one({
                    "regNo": key_rx,
                    "$or": [{"emailId": input_rx}, {"collegeEmailId": input_rx}, {"phoneNumber": input_rx}]
                })

            if user_doc:
                user_regs = list(db.registrations.find({"userId": user_doc["_id"]}, {"_id": 0}))
                for r in user_regs:
                    if "userId" in r:
                        r["userId"] = str(r["userId"])
                    merged = dict(user_doc)
                    merged.pop("_id", None)
                    merged.update(r)
                    regs.append(merged)

        # Fallback to local store if db is offline or empty search
        if not regs and LOCAL_USERS:
            search_low = input_val.lower()
            key_low = key.lower()
            
            local_user = None
            # Find user by email/phone AND regNo
            for u in LOCAL_USERS:
                em = u.get("emailId", "").lower()
                cem = u.get("collegeEmailId", "").lower()
                ph = u.get("phoneNumber", "").lower()
                rg = u.get("regNo", "").lower()
                
                if (search_low in (em, cem, ph)) and (key_low == rg):
                    local_user = u
                    break
            
            # Find by email/phone AND submissionId
            if not local_user:
                for r in LOCAL_REGISTRATIONS:
                    if r.get("submissionId", "").lower() == key_low:
                        user_id = r.get("userId")
                        # verify user matches email/phone
                        u = next((usr for usr in LOCAL_USERS if usr.get("id") == user_id), None)
                        if u:
                            em = u.get("emailId", "").lower()
                            cem = u.get("collegeEmailId", "").lower()
                            ph = u.get("phoneNumber", "").lower()
                            if search_low in (em, cem, ph):
                                local_user = u
                        break

            if local_user:
                for r in LOCAL_REGISTRATIONS:
                    if r.get("userId") == local_user.get("id"):
                        merged = dict(local_user)
                        merged.update(r)
                        regs.append(merged)

        if not regs:
            return jsonify({"error": f"No registration record found for '{input_val}'. Please verify your registered email or Roll No."}), 404

        # Check if participant status is BANNED / SUSPENDED
        for r in regs:
            if r.get("status") in ("BANNED", "SUSPENDED"):
                return jsonify({"error": "ACCOUNT BANNED: Your account has been banned or suspended by HiveMind Admin."}), 403

        participant_email = regs[0].get("emailId") or regs[0].get("collegeEmailId") or input_val
        participant_name = regs[0].get("name", "Participant")

        # Create JWT token
        expiration = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30)
        token = jwt.encode({
            "email": participant_email,
            "name": participant_name,
            "role": "participant",
            "exp": expiration
        }, JWT_SECRET, algorithm="HS256")

        return jsonify({
            "success": True,
            "token": token,
            "user": {
                "email": participant_email,
                "name": participant_name,
                "role": "participant"
            },
            "registrations": regs
        }), 200

    except Exception as err:
        print(f"❌ participant_login error: {err}")
        return jsonify({"error": "Login failed. Please try again."}), 500


# 2. Admin Login Endpoint (Queries MongoDB Atlas `admin_users` Collection)
@auth_bp.route("/api/admin/login", methods=["POST"])
def admin_login():
    try:
        data = request.get_json() or {}
        username = (data.get("username") or "").strip().lower()
        password = (data.get("password") or "").strip()

        if not username or not password:
            return jsonify({"error": "Admin Username and Password required"}), 400

        is_valid = False

        if db is not None:
            admin_user = db.admin_users.find_one({"username": username}, {"_id": 0})
            if admin_user and admin_user.get("password") == password:
                is_valid = True

        # Fallback check against env vars if DB is empty or fallback mode
        if not is_valid and username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            is_valid = True

        if is_valid:
            expiration = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
            token = jwt.encode({
                "username": username,
                "role": "admin",
                "exp": expiration
            }, JWT_SECRET, algorithm="HS256")

            return jsonify({
                "success": True,
                "token": token,
                "admin": {"username": username, "role": "admin"},
                "message": "Welcome Admin to SSDC HiveMind Portal!"
            }), 200
        else:
            return jsonify({"error": "Invalid Admin Username or Password"}), 401

    except Exception as err:
        print(f"❌ admin_login error: {err}")
        return jsonify({"error": "Admin login failed."}), 500
