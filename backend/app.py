import os
import csv
import io
import random
import datetime
from functools import wraps
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/hivemind_db")
JWT_SECRET = os.getenv("JWT_SECRET", "hivemind_super_secret_jwt_key_2026_ssdc")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin@ssdc.sliet").lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin2026")
PORT = int(os.getenv("PORT", 5000))

# In-Memory Backup Store (Used if MongoDB Atlas is connecting or offline)
LOCAL_REGISTRATIONS = []
LOCAL_RESULTS = []
LOCAL_NOTICES = []

client = None
db = None
mongo_error_msg = None

# Initialize MongoDB Connection safely
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    try:
        db = client.get_database()
        if not db.name or db.name in ["test", "admin"]:
            db = client["hivemind_db"]
    except Exception:
        db = client["hivemind_db"]

    # Test server connection ping
    client.admin.command("ping")
    print(f"✅ Connected to MongoDB Atlas Database: '{db.name}'")

    # Ensure indexes & Upsert Admin Account from .env
    try:
        db.registrations.create_index([("emailId", 1)])
        db.registrations.create_index([("phoneNumber", 1)])
        db.results.create_index([("eventId", 1)], unique=True)
        db.admin_users.create_index([("username", 1)], unique=True)

        # Upsert admin account in MongoDB Atlas
        db.admin_users.update_one(
            {"username": ADMIN_USERNAME},
            {"$set": {
                "username": ADMIN_USERNAME,
                "password": ADMIN_PASSWORD,
                "role": "admin",
                "updatedAt": datetime.datetime.utcnow().isoformat()
            }},
            upsert=True
        )
        print(f"👑 Admin Account Synced to MongoDB Atlas `admin_users`: {ADMIN_USERNAME}")
    except Exception as idx_err:
        print(f"Index/Admin notice: {idx_err}")

except Exception as err:
    mongo_error_msg = str(err)
    print(f"⚠️ MongoDB Connection Notice: {err}")
    print("ℹ️ Operating with automatic local store fallback until MongoDB Atlas connects.")
    db = None


# JWT Authentication Middleware
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Authorization token missing"}), 401

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired. Please login again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid authentication token."}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# Healthcheck Endpoint
@app.route("/api/health", methods=["GET"])
def health_check():
    mongo_status = "connected" if db is not None else "disconnected"
    return jsonify({
        "status": "online",
        "service": "HiveMind 2026 MongoDB REST API",
        "mongodb": mongo_status,
        "database": db.name if db is not None else "local_fallback",
        "mongo_error": mongo_error_msg,
        "registrationsCount": db.registrations.count_documents({}) if db is not None else len(LOCAL_REGISTRATIONS),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }), 200


# 1. Participant Login Endpoint (Email + Submission ID or Roll No)
@app.route("/api/auth/login", methods=["POST"])
def participant_login():
    try:
        data = request.get_json() or {}
        input_val = (data.get("email") or data.get("emailId") or data.get("submissionId") or "").strip()
        key = (data.get("submissionId") or data.get("regNo") or "").strip()

        if not input_val and not key:
            return jsonify({"error": "Please enter your registered Email ID, Submission ID, or Roll Number"}), 400

        regs = []

        if db is not None:
            search_terms = [input_val]
            if key:
                search_terms.append(key)

            or_conditions = []
            for term in search_terms:
                if not term:
                    continue
                rx = {"$regex": f"^{term}$", "$options": "i"}
                or_conditions.extend([
                    {"emailId": rx},
                    {"collegeEmailId": rx},
                    {"submissionId": rx},
                    {"regNo": rx},
                    {"phoneNumber": rx}
                ])

            regs = list(db.registrations.find({"$or": or_conditions}, {"_id": 0}))

        # Fallback to local store if db is offline or empty search
        if not regs and LOCAL_REGISTRATIONS:
            search_low = input_val.lower()
            key_low = key.lower()
            for r in LOCAL_REGISTRATIONS:
                em = r.get("emailId", "").lower()
                cem = r.get("collegeEmailId", "").lower()
                sub = r.get("submissionId", "").lower()
                rg = r.get("regNo", "").lower()
                ph = r.get("phoneNumber", "").lower()

                if search_low in (em, cem, sub, rg, ph) or (key_low and key_low in (sub, rg)):
                    regs.append(r)

        if not regs:
            return jsonify({"error": f"No registration record found for '{input_val}'. Please verify your registered email or Roll No."}), 404

        participant_email = regs[0].get("emailId") or regs[0].get("collegeEmailId") or input_val
        participant_name = regs[0].get("name", "Participant")

        # Create JWT token
        expiration = datetime.datetime.utcnow() + datetime.timedelta(days=30)
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
        return jsonify({"error": str(err)}), 500


# 2. Admin Login Endpoint (Queries MongoDB Atlas `admin_users` Collection)
@app.route("/api/admin/login", methods=["POST"])
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
            expiration = datetime.datetime.utcnow() + datetime.timedelta(days=7)
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
        return jsonify({"error": str(err)}), 500


# 3. Direct Event Registration Endpoint (Saves to MongoDB Atlas & Local Store)
@app.route("/api/register", methods=["POST"])
def register_event():
    try:
        data = request.get_json() or request.form.to_dict() or {}

        name = (data.get("name") or "").strip()
        personal_email = (data.get("emailId") or "").strip().lower()
        college_email = (data.get("collegeEmailId") or "").strip().lower()
        reg_no = (data.get("regNo") or "").strip()
        trade = (data.get("trade") or "").strip()
        phone_number = (data.get("phoneNumber") or "").strip()
        college = (data.get("college") or "SLIET").strip()
        degree = (data.get("degree") or "").strip()
        batch_year = (data.get("batchYear") or "").strip()
        selected_event = (data.get("selectedEvent") or "All Events / General Pass").strip()

        if not name or not personal_email or not phone_number or not reg_no:
            return jsonify({"error": "Required fields missing: Full Name, Email, Roll No, Phone Number"}), 400

        submission_id = data.get("submissionId") or f"HM26-{random.randint(100000, 999999)}"

        registration_doc = {
            "submissionId": submission_id,
            "name": name,
            "emailId": personal_email,
            "collegeEmailId": college_email,
            "regNo": reg_no,
            "trade": trade,
            "phoneNumber": phone_number,
            "college": college,
            "degree": degree,
            "batchYear": batch_year,
            "selectedEvent": selected_event,
            "status": "CONFIRMED",
            "registeredAt": datetime.datetime.utcnow().isoformat()
        }

        if db is not None:
            # Duplicate check 1: Personal Email or College Email for SAME event
            existing_event = db.registrations.find_one({
                "selectedEvent": selected_event,
                "$or": [
                    {"emailId": personal_email},
                    {"collegeEmailId": personal_email},
                    {"emailId": college_email},
                    {"collegeEmailId": college_email}
                ]
            })

            if existing_event:
                return jsonify({
                    "error": f"DUPLICATE REGISTRATION: Email ({personal_email}) is already registered for '{selected_event}' (Submission ID: {existing_event.get('submissionId')})."
                }), 409

            # Duplicate check 2: Phone number for same event
            existing_phone = db.registrations.find_one({
                "selectedEvent": selected_event,
                "phoneNumber": phone_number
            })
            if existing_phone:
                return jsonify({
                    "error": f"DUPLICATE REGISTRATION: Phone Number ({phone_number}) is already registered for '{selected_event}'."
                }), 409

            # Insert registration document into MongoDB Atlas
            db.registrations.insert_one(registration_doc)
            print(f"📥 [MongoDB Atlas] New Registration Saved! Name: {name} | Email: {personal_email} | Event: {selected_event} | ID: {submission_id}")
            registration_doc.pop("_id", None)
        else:
            # Save to Local Fallback Store
            LOCAL_REGISTRATIONS.append(registration_doc)
            print(f"📥 [Local Store] New Registration Saved! Name: {name} | Email: {personal_email} | Event: {selected_event} | ID: {submission_id}")

        return jsonify({
            "success": True,
            "submissionId": submission_id,
            "message": f"Successfully registered for {selected_event}!",
            "registration": registration_doc
        }), 201

    except Exception as err:
        return jsonify({"error": str(err)}), 500


# 4. Check Registrations Endpoint
@app.route("/api/registrations/check", methods=["GET"])
def check_registrations():
    try:
        email = request.args.get("emailId") or request.args.get("email") or ""
        phone = request.args.get("phoneNumber") or request.args.get("phone") or ""
        event = request.args.get("selectedEvent") or ""

        email = email.strip().lower()
        phone = phone.strip()
        event = event.strip()

        if db is not None:
            if email and event:
                match = db.registrations.find_one({
                    "selectedEvent": event,
                    "$or": [{"emailId": email}, {"collegeEmailId": email}]
                }, {"_id": 0})
                if match:
                    return jsonify({"isDuplicate": True, "message": f"Email ({email}) is already registered for '{event}'."})

            if phone and event:
                match = db.registrations.find_one({"selectedEvent": event, "phoneNumber": phone}, {"_id": 0})
                if match:
                    return jsonify({"isDuplicate": True, "message": f"Phone Number ({phone}) is already registered for '{event}'."})
        else:
            for r in LOCAL_REGISTRATIONS:
                if event and r.get("selectedEvent") == event:
                    if email and (r.get("emailId") == email or r.get("collegeEmailId") == email):
                        return jsonify({"isDuplicate": True, "message": f"Email ({email}) is already registered for '{event}'."})
                    if phone and r.get("phoneNumber") == phone:
                        return jsonify({"isDuplicate": True, "message": f"Phone Number ({phone}) is already registered for '{event}'."})

        return jsonify({"isDuplicate": False}), 200

    except Exception as err:
        return jsonify({"error": str(err)}), 500


# 5. Admin: Fetch All Registrations with Event Filter
@app.route("/api/admin/registrations", methods=["GET"])
def admin_get_registrations():
    try:
        event_filter = request.args.get("event") or ""
        search_query = request.args.get("search") or ""

        regs = []
        if db is not None:
            query = {}
            if event_filter and event_filter != "ALL":
                query["selectedEvent"] = {"$regex": event_filter, "$options": "i"}

            if search_query:
                query["$or"] = [
                    {"name": {"$regex": search_query, "$options": "i"}},
                    {"emailId": {"$regex": search_query, "$options": "i"}},
                    {"regNo": {"$regex": search_query, "$options": "i"}},
                    {"phoneNumber": {"$regex": search_query, "$options": "i"}},
                    {"submissionId": {"$regex": search_query, "$options": "i"}},
                ]

            cursor = db.registrations.find(query, {"_id": 0}).sort("registeredAt", -1)
            regs = list(cursor)
        else:
            regs = list(LOCAL_REGISTRATIONS)

        return jsonify({
            "count": len(regs),
            "registrations": regs
        }), 200

    except Exception as err:
        return jsonify({"error": str(err)}), 500


# 6. Admin: Export Registrations Data to CSV / Excel Spreadsheet
@app.route("/api/admin/export", methods=["GET"])
@app.route("/api/admin/export/excel", methods=["GET"])
def admin_export_data():
    try:
        event_filter = request.args.get("event") or ""
        export_format = (request.args.get("format") or "").lower()
        is_excel = "excel" in request.path or export_format == "excel" or export_format == "xlsx"

        regs = []
        if db is not None:
            query = {}
            if event_filter and event_filter != "ALL":
                query["selectedEvent"] = {"$regex": event_filter, "$options": "i"}
            cursor = db.registrations.find(query, {"_id": 0}).sort("registeredAt", -1)
            regs = list(cursor)
        else:
            regs = list(LOCAL_REGISTRATIONS)

        headers = [
            "Submission ID",
            "Full Name",
            "Personal Email",
            "College Email",
            "Registration / Roll No",
            "Trade / Branch",
            "Phone Number",
            "College Name",
            "Degree Program",
            "Batch Year",
            "Selected Event",
            "Status",
            "Registered Timestamp"
        ]

        if is_excel:
            # Generate MS Excel XML / HTML Spreadsheet
            html_rows = []
            html_rows.append('<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">')
            html_rows.append('<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Registrations</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>')
            html_rows.append('<body><table border="1" style="border-collapse:collapse; font-family:Arial,sans-serif; font-size:12px;">')
            
            # Header row
            html_rows.append('<tr style="background-color:#00cfff; color:#0d1117; font-weight:bold; text-align:center;">')
            for h in headers:
                html_rows.append(f'<th style="padding:8px 12px; border:1px solid #000000;">{h}</th>')
            html_rows.append('</tr>')

            # Data rows
            for r in regs:
                html_rows.append('<tr>')
                vals = [
                    r.get("submissionId", ""),
                    r.get("name", ""),
                    r.get("emailId", ""),
                    r.get("collegeEmailId", ""),
                    r.get("regNo", ""),
                    r.get("trade", ""),
                    r.get("phoneNumber", ""),
                    r.get("college", ""),
                    r.get("degree", ""),
                    r.get("batchYear", ""),
                    r.get("selectedEvent", ""),
                    r.get("status", "CONFIRMED"),
                    r.get("registeredAt", "")
                ]
                for v in vals:
                    html_rows.append(f'<td style="padding:6px 10px; border:1px solid #cccccc;">{v}</td>')
                html_rows.append('</tr>')

            html_rows.append('</table></body></html>')
            excel_content = "\n".join(html_rows)

            filename = f"HiveMind_Registrations_{event_filter or 'ALL'}_{datetime.date.today().strftime('%Y%m%d')}.xls"
            return Response(
                excel_content,
                mimetype="application/vnd.ms-excel",
                headers={"Content-disposition": f"attachment; filename={filename}"}
            )
        else:
            # Generate Standard CSV
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(headers)

            for r in regs:
                writer.writerow([
                    r.get("submissionId", ""),
                    r.get("name", ""),
                    r.get("emailId", ""),
                    r.get("collegeEmailId", ""),
                    r.get("regNo", ""),
                    r.get("trade", ""),
                    r.get("phoneNumber", ""),
                    r.get("college", ""),
                    r.get("degree", ""),
                    r.get("batchYear", ""),
                    r.get("selectedEvent", ""),
                    r.get("status", "CONFIRMED"),
                    r.get("registeredAt", "")
                ])

            filename = f"HiveMind_Registrations_{event_filter or 'ALL'}_{datetime.date.today().strftime('%Y%m%d')}.csv"
            return Response(
                output.getvalue(),
                mimetype="text/csv",
                headers={"Content-disposition": f"attachment; filename={filename}"}
            )

    except Exception as err:
        return jsonify({"error": str(err)}), 500


# 7. Admin: Publish & Update Event Results / Winners in MongoDB Atlas
@app.route("/api/admin/results", methods=["POST"])
def admin_publish_results():
    try:
        data = request.get_json() or {}
        event_id = data.get("eventId")
        event_title = data.get("eventTitle")
        winner_1st = data.get("winner1st") or ""
        winner_2nd = data.get("winner2nd") or ""
        winner_3rd = data.get("winner3rd") or ""
        special_mentions = data.get("specialMentions") or ""
        announcement_notes = data.get("announcementNotes") or ""
        event_status = data.get("eventStatus") or "RESULTS ANNOUNCED"

        if not event_id or not event_title:
            return jsonify({"error": "Missing eventId or eventTitle"}), 400

        result_doc = {
            "eventId": event_id,
            "eventTitle": event_title,
            "winner1st": winner_1st,
            "winner2nd": winner_2nd,
            "winner3rd": winner_3rd,
            "specialMentions": special_mentions,
            "announcementNotes": announcement_notes,
            "eventStatus": event_status,
            "publishedAt": datetime.datetime.utcnow().isoformat()
        }

        if db is not None:
            db.results.update_one(
                {"eventId": event_id},
                {"$set": result_doc},
                upsert=True
            )
            print(f"🏆 [MongoDB Atlas] Results Published for {event_title}! Winner: {winner_1st}")
            result_doc.pop("_id", None)
        else:
            LOCAL_RESULTS.append(result_doc)
            print(f"🏆 [Local Store] Results Published for {event_title}! Winner: {winner_1st}")

        return jsonify({
            "success": True,
            "message": f"Results for '{event_title}' published successfully!",
            "result": result_doc
        }), 200

    except Exception as err:
        return jsonify({"error": str(err)}), 500


# 9. Admin: Post & Publish Official Notices / Event News to MongoDB Atlas
@app.route("/api/admin/notices", methods=["POST"])
def admin_publish_notice():
    try:
        data = request.get_json() or {}
        title = (data.get("title") or "").strip()
        category = (data.get("category") or "GENERAL NOTICE").strip()
        target_event = (data.get("targetEvent") or "ALL EVENTS").strip()
        content = (data.get("content") or "").strip()
        priority = (data.get("priority") or "NORMAL").strip().upper()

        if not title or not content:
            return jsonify({"error": "Title and Content are required for a Notice"}), 400

        notice_id = f"NOTICE-{random.randint(1000, 9999)}"
        notice_doc = {
            "noticeId": notice_id,
            "title": title,
            "category": category,
            "targetEvent": target_event,
            "content": content,
            "priority": priority,
            "publishedAt": datetime.datetime.utcnow().isoformat()
        }

        if db is not None:
            db.notices.insert_one(notice_doc)
            print(f"📢 [MongoDB Atlas] Notice Published: '{title}' ({category})")
            notice_doc.pop("_id", None)
        else:
            LOCAL_NOTICES.append(notice_doc)
            print(f"📢 [Local Store] Notice Published: '{title}' ({category})")

        return jsonify({
            "success": True,
            "noticeId": notice_id,
            "message": "Notice published successfully!",
            "notice": notice_doc
        }), 201

    except Exception as err:
        return jsonify({"error": str(err)}), 500


# 10. Admin: Delete a Published Notice
@app.route("/api/admin/notices/<notice_id>", methods=["DELETE"])
def admin_delete_notice(notice_id):
    try:
        if db is not None:
            db.notices.delete_one({"noticeId": notice_id})
        else:
            global LOCAL_NOTICES
            LOCAL_NOTICES = [n for n in LOCAL_NOTICES if n.get("noticeId") != notice_id]

        return jsonify({"success": True, "message": f"Notice {notice_id} deleted."}), 200

    except Exception as err:
        return jsonify({"error": str(err)}), 500


# 11. Public & Participant Endpoint: Read All Active Official Notices
@app.route("/api/notices", methods=["GET"])
def get_all_notices():
    try:
        notices = []
        if db is not None:
            cursor = db.notices.find({}, {"_id": 0}).sort("publishedAt", -1)
            notices = list(cursor)
        else:
            notices = list(LOCAL_NOTICES)

        return jsonify({
            "count": len(notices),
            "notices": notices
        }), 200

    except Exception as err:
        return jsonify({"error": str(err)}), 500


if __name__ == "__main__":
    print(f"🚀 Starting HiveMind 2026 MongoDB REST API on http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
