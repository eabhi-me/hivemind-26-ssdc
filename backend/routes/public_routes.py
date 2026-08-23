import datetime
import re
import random
from flask import Blueprint, request, jsonify

from database import db, LOCAL_USERS, LOCAL_REGISTRATIONS, LOCAL_RESULTS, LOCAL_NOTICES, LOCAL_EVENTS

public_bp = Blueprint('public', __name__)


def _safe_regex(user_input):
    """Escape user input for safe use in MongoDB $regex queries."""
    return re.escape(user_input)


def _parse_iso(iso_str):
    """Safely parse an ISO date string to a datetime object, or return None."""
    if not iso_str:
        return None
    try:
        # Handle both Z suffix and +00:00
        cleaned = iso_str.replace("Z", "+00:00")
        return datetime.datetime.fromisoformat(cleaned)
    except (ValueError, TypeError):
        return None


# Root Healthcheck Endpoint for Render Scanner & Uptime Monitoring
@public_bp.route("/", methods=["GET", "HEAD"])
def root_check():
    db_status = "connected" if db is not None else "disconnected"
    return jsonify({
        "status": "online",
        "service": "HiveMind 2026 REST API",
        "database_status": db_status,
        "database": db.name if db is not None else "local_fallback",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }), 200


# API Healthcheck Endpoint
@public_bp.route("/api/health", methods=["GET"])
def health_check():
    db_status = "connected" if db is not None else "disconnected"
    return jsonify({
        "status": "online",
        "service": "HiveMind 2026 REST API",
        "database_status": db_status,
        "database": db.name if db is not None else "local_fallback",
        "registrationsCount": db.registrations.count_documents({}) if db is not None else len(LOCAL_REGISTRATIONS),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }), 200


# Track Page Visit & Render Keep-Alive
@public_bp.route("/api/visit", methods=["POST"])
def record_visit():
    try:
        count = 0
        if db is not None:
            db.metrics.update_one(
                {"type": "page_visits"},
                {"$inc": {"count": 1}},
                upsert=True
            )
            result = db.metrics.find_one({"type": "page_visits"})
            count = result.get("count", 0) if result else 0
        return jsonify({"success": True, "visits": count}), 200
    except Exception as err:
        print(f"❌ record_visit error: {err}")
        return jsonify({"error": "Failed to record visit."}), 500


# 5d. Public & Participant: Get All Events with Dynamic Online / Offline Schedule Check
@public_bp.route("/api/events", methods=["GET"])
def get_events():
    try:
        events = []
        if db is not None:
            cursor = db.events.find({}, {"_id": 0})
            events = list(cursor)
            if not events:
                events = list(LOCAL_EVENTS)
        else:
            events = list(LOCAL_EVENTS)

        now = datetime.datetime.now(datetime.timezone.utc)

        for ev in events:
            start_dt = _parse_iso(ev.get("isoStartDate", ""))
            end_dt = _parse_iso(ev.get("isoEndDate", ""))

            if start_dt and end_dt:
                if now < start_dt:
                    ev["scheduleStatus"] = "SCHEDULED_UPCOMING"
                elif now > end_dt:
                    ev["scheduleStatus"] = "SCHEDULED_CLOSED"
                    ev["registrationOpen"] = False
                    ev["isOnline"] = False
                else:
                    ev["scheduleStatus"] = "SCHEDULED_LIVE"

            if ev.get("registrationOpen") and ev.get("isOnline"):
                ev["liveStatus"] = "ONLINE"
            else:
                ev["liveStatus"] = "OFFLINE"

        return jsonify({
            "count": len(events),
            "events": events
        }), 200

    except Exception as err:
        print(f"❌ get_events error: {err}")
        return jsonify({"error": "Failed to fetch events."}), 500


# 3. Direct Event Registration Endpoint (Saves to MongoDB Atlas & Local Store)
@public_bp.route("/api/register", methods=["POST"])
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
        selected_event = (data.get("selectedEvent") or "EVENT_01 — Web Craft").strip()

        if not name or not personal_email or not phone_number or not reg_no:
            return jsonify({"error": "Required fields missing: Full Name, Email, Roll No, Phone Number"}), 400

        # Backend Validation
        email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_regex, personal_email):
            return jsonify({"error": f"Invalid Personal Email format: '{personal_email}'"}), 400

        if college_email and not re.match(email_regex, college_email):
            return jsonify({"error": f"Invalid College Email format: '{college_email}'"}), 400

        phone_regex = r"^[6-9]\d{9}$"
        if not re.match(phone_regex, phone_number):
            return jsonify({"error": f"Invalid Phone Number '{phone_number}'. Must be a valid 10-digit Indian mobile number."}), 400

        if len(reg_no) < 3:
            return jsonify({"error": "Invalid Roll/Registration Number. Must be at least 3 characters."}), 400

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
            "registeredAt": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

        if db is not None:
            # Upsert User Doc
            user_payload = {
                "name": name,
                "emailId": personal_email,
                "collegeEmailId": college_email,
                "regNo": reg_no,
                "trade": trade,
                "phoneNumber": phone_number,
                "college": college,
                "degree": degree,
                "batchYear": batch_year
            }
            
            existing_user = db.users.find_one({
                "$or": [{"emailId": personal_email}, {"regNo": reg_no}, {"phoneNumber": phone_number}]
            })
            
            if existing_user:
                db.users.update_one({"_id": existing_user["_id"]}, {"$set": user_payload})
                user_id = existing_user["_id"]
            else:
                user_payload["createdAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
                result = db.users.insert_one(user_payload)
                user_id = result.inserted_id

            # Duplicate check: check if this user is already registered for this event
            existing_reg = db.registrations.find_one({
                "userId": user_id,
                "selectedEvent": selected_event
            })

            if existing_reg:
                return jsonify({
                    "error": f"DUPLICATE REGISTRATION: You are already registered for '{selected_event}' (Submission ID: {existing_reg.get('submissionId')})."
                }), 409

            # Insert registration document into MongoDB Atlas
            registration_doc = {
                "userId": user_id,
                "selectedEvent": selected_event,
                "submissionId": submission_id,
                "status": "CONFIRMED",
                "registeredAt": datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            db.registrations.insert_one(registration_doc)
            print(f"📥 [MongoDB Atlas] New Registration Saved! Name: {name} | Email: {personal_email} | Event: {selected_event} | ID: {submission_id}")
            
            registration_doc["userId"] = str(user_id)
            registration_doc.update(user_payload)
            registration_doc.pop("_id", None)
        else:
            # Save to Local Fallback Store
            local_user = next((u for u in LOCAL_USERS if u.get("emailId") == personal_email or u.get("regNo") == reg_no), None)
            if not local_user:
                local_user = {
                    "id": f"usr_{random.randint(1000, 9999)}",
                    "name": name,
                    "emailId": personal_email,
                    "collegeEmailId": college_email,
                    "regNo": reg_no,
                    "trade": trade,
                    "phoneNumber": phone_number,
                    "college": college,
                    "degree": degree,
                    "batchYear": batch_year
                }
                LOCAL_USERS.append(local_user)
            else:
                local_user.update({
                    "name": name,
                    "collegeEmailId": college_email,
                    "trade": trade,
                    "phoneNumber": phone_number,
                    "college": college,
                    "degree": degree,
                    "batchYear": batch_year
                })

            for r in LOCAL_REGISTRATIONS:
                if r.get("selectedEvent") == selected_event and r.get("userId") == local_user["id"]:
                    return jsonify({"error": f"DUPLICATE REGISTRATION: You are already registered for this event."}), 409

            registration_doc = {
                "userId": local_user["id"],
                "selectedEvent": selected_event,
                "submissionId": submission_id,
                "status": "CONFIRMED",
                "registeredAt": datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            LOCAL_REGISTRATIONS.append(registration_doc)
            print(f"📥 [Local Store] New Registration Saved! Name: {name} | Email: {personal_email} | Event: {selected_event} | ID: {submission_id}")
            
            registration_doc.update(local_user)

        return jsonify({
            "success": True,
            "submissionId": submission_id,
            "message": f"Successfully registered for {selected_event}!",
            "registration": registration_doc
        }), 201

    except Exception as err:
        print(f"❌ register_event error: {err}")
        return jsonify({"error": "Registration failed. Please try again."}), 500


# 4. Check Registrations Endpoint
@public_bp.route("/api/registrations/check", methods=["GET"])
def check_registrations():
    try:
        email = request.args.get("emailId") or request.args.get("email") or ""
        phone = request.args.get("phoneNumber") or request.args.get("phone") or ""
        reg_no = request.args.get("regNo") or ""
        event = request.args.get("selectedEvent") or ""

        email = email.strip().lower()
        phone = phone.strip()
        reg_no = reg_no.strip()
        event = event.strip()

        if db is not None:
            if email and event:
                user = db.users.find_one({"$or": [{"emailId": email}, {"collegeEmailId": email}]})
                if user and db.registrations.find_one({"userId": user["_id"], "selectedEvent": event}):
                    return jsonify({"isDuplicate": True, "message": f"Email ({email}) is already registered for '{event}'."})

            if phone and event:
                user = db.users.find_one({"phoneNumber": phone})
                if user and db.registrations.find_one({"userId": user["_id"], "selectedEvent": event}):
                    return jsonify({"isDuplicate": True, "message": f"Phone Number ({phone}) is already registered for '{event}'."})

            if reg_no and event:
                user = db.users.find_one({"regNo": reg_no})
                if user and db.registrations.find_one({"userId": user["_id"], "selectedEvent": event}):
                    return jsonify({"isDuplicate": True, "message": f"Roll No ({reg_no}) is already registered for '{event}'."})
        else:
            for r in LOCAL_REGISTRATIONS:
                if event and r.get("selectedEvent") == event:
                    if email and (r.get("emailId") == email or r.get("collegeEmailId") == email):
                        return jsonify({"isDuplicate": True, "message": f"Email ({email}) is already registered for '{event}'."})
                    if phone and r.get("phoneNumber") == phone:
                        return jsonify({"isDuplicate": True, "message": f"Phone Number ({phone}) is already registered for '{event}'."})
                    if reg_no and r.get("regNo") == reg_no:
                        return jsonify({"isDuplicate": True, "message": f"Roll No ({reg_no}) is already registered for '{event}'."})

        return jsonify({"isDuplicate": False}), 200

    except Exception as err:
        print(f"❌ check_registrations error: {err}")
        return jsonify({"error": "Failed to check registrations."}), 500


# 11. Public & Participant Endpoint: Read All Active Official Notices
@public_bp.route("/api/notices", methods=["GET"])
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
        print(f"❌ get_all_notices error: {err}")
        return jsonify({"error": "Failed to fetch notices."}), 500
