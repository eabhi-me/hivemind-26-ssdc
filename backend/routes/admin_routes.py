import datetime
import re
import csv
import io
import html
import uuid
import openpyxl
from flask import Blueprint, request, jsonify, Response, send_file

from database import db, LOCAL_USERS, LOCAL_REGISTRATIONS, LOCAL_RESULTS, LOCAL_NOTICES, LOCAL_EVENTS, ADMIN_USERNAME, ADMIN_PASSWORD
from auth import admin_required

admin_bp = Blueprint('admin', __name__)


def _safe_regex(user_input):
    """Escape user input for safe use in MongoDB $regex queries."""
    return re.escape(user_input)


# Admin Metrics Endpoint
@admin_bp.route("/api/admin/metrics", methods=["GET"])
@admin_required
def admin_get_metrics(current_user):
    try:
        page_visits = 0
        if db is not None:
            result = db.metrics.find_one({"type": "page_visits"})
            page_visits = result.get("count", 0) if result else 0
        
        return jsonify({
            "success": True,
            "page_visits": page_visits
        }), 200
    except Exception as err:
        print(f"❌ admin_get_metrics error: {err}")
        return jsonify({"error": "Failed to fetch metrics."}), 500


# 4b. Admin: Fetch All Users
@admin_bp.route("/api/admin/users", methods=["GET"])
@admin_required
def admin_get_users(current_user):
    try:
        search_query = request.args.get("search", "").strip()

        users = []
        if db is not None:
            query = {}
            if search_query:
                safe_q = _safe_regex(search_query)
                query["$or"] = [
                    {"name": {"$regex": safe_q, "$options": "i"}},
                    {"emailId": {"$regex": safe_q, "$options": "i"}},
                    {"regNo": {"$regex": safe_q, "$options": "i"}},
                    {"phoneNumber": {"$regex": safe_q, "$options": "i"}},
                ]

            cursor = db.users.find(query).sort("name", 1)
            for user in cursor:
                user["_id"] = str(user["_id"])
                users.append(user)
        else:
            if search_query:
                q = search_query.lower()
                users = [u for u in LOCAL_USERS if q in u.get("name", "").lower() or q in u.get("emailId", "").lower() or q in u.get("regNo", "").lower()]
            else:
                users = LOCAL_USERS
            users.sort(key=lambda x: x.get("name", ""))

        return jsonify({
            "count": len(users),
            "users": users
        }), 200

    except Exception as err:
        print(f"❌ admin_get_users error: {err}")
        return jsonify({"error": "Failed to fetch users."}), 500


# 4c. Admin: Delete User (Cascading)
@admin_bp.route("/api/admin/users/<user_id>", methods=["DELETE"])
@admin_required
def admin_delete_user(current_user, user_id):
    try:
        from bson.objectid import ObjectId
        if db is not None:
            # 1. Delete the user
            user_res = db.users.delete_one({"_id": ObjectId(user_id)})
            if user_res.deleted_count == 0:
                return jsonify({"error": "User not found."}), 404
                
            # 2. Delete all their registrations (cascading)
            db.registrations.delete_many({"userId": ObjectId(user_id)})
            
            return jsonify({"success": True, "message": "User and associated registrations deleted."}), 200
        else:
            return jsonify({"error": "Cannot delete local users."}), 400
    except Exception as err:
        print(f"❌ admin_delete_user error: {err}")
        return jsonify({"error": "Failed to delete user."}), 500


# 4d. Admin: Toggle User Ban
@admin_bp.route("/api/admin/users/<user_id>/ban", methods=["PUT"])
@admin_required
def admin_toggle_user_ban(current_user, user_id):
    try:
        from bson.objectid import ObjectId
        data = request.get_json() or {}
        is_banned = data.get("isBanned", False)
        
        if db is not None:
            res = db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"isBanned": is_banned}})
            if res.matched_count == 0:
                return jsonify({"error": "User not found."}), 404
            
            status_msg = "banned" if is_banned else "unbanned"
            return jsonify({"success": True, "message": f"User successfully {status_msg}."}), 200
        else:
            return jsonify({"error": "Cannot ban local users."}), 400
    except Exception as err:
        print(f"❌ admin_toggle_user_ban error: {err}")
        return jsonify({"error": "Failed to update ban status."}), 500


# 5. Admin: Fetch All Registrations with Event Filter
@admin_bp.route("/api/admin/registrations", methods=["GET"])
@admin_required
def admin_get_registrations(current_user):
    try:
        event_filter = request.args.get("event") or ""
        search_query = request.args.get("search") or ""

        regs = []
        if db is not None:
            pipeline = [
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "userId",
                        "foreignField": "_id",
                        "as": "user"
                    }
                },
                {"$unwind": {"path": "$user", "preserveNullAndEmptyArrays": True}},
                {
                    "$addFields": {
                        "name": "$user.name",
                        "emailId": "$user.emailId",
                        "collegeEmailId": "$user.collegeEmailId",
                        "regNo": "$user.regNo",
                        "trade": "$user.trade",
                        "phoneNumber": "$user.phoneNumber",
                        "college": "$user.college",
                        "degree": "$user.degree",
                        "batchYear": "$user.batchYear"
                    }
                },
                {"$project": {"user": 0, "userId": 0, "_id": 0}}
            ]
            
            match_stage = {}
            if event_filter and event_filter != "ALL":
                match_stage["selectedEvent"] = {"$regex": _safe_regex(event_filter), "$options": "i"}
                
            if search_query:
                safe_sq = _safe_regex(search_query)
                match_stage["$or"] = [
                    {"name": {"$regex": safe_sq, "$options": "i"}},
                    {"emailId": {"$regex": safe_sq, "$options": "i"}},
                    {"regNo": {"$regex": safe_sq, "$options": "i"}},
                    {"phoneNumber": {"$regex": safe_sq, "$options": "i"}},
                    {"submissionId": {"$regex": safe_sq, "$options": "i"}},
                ]
            
            if match_stage:
                pipeline.append({"$match": match_stage})
                
            pipeline.append({"$sort": {"registeredAt": -1}})
            
            cursor = db.registrations.aggregate(pipeline)
            regs = list(cursor)
        else:
            for r in LOCAL_REGISTRATIONS:
                if event_filter and event_filter != "ALL" and event_filter.lower() not in r.get("selectedEvent", "").lower():
                    continue
                if search_query:
                    sq = search_query.lower()
                    if sq not in r.get("name", "").lower() and sq not in r.get("emailId", "").lower() and \
                       sq not in r.get("regNo", "").lower() and sq not in r.get("phoneNumber", "").lower() and \
                       sq not in r.get("submissionId", "").lower():
                        continue
                regs.append(r)
            regs.sort(key=lambda x: x.get("registeredAt", ""), reverse=True)

        return jsonify({
            "count": len(regs),
            "registrations": regs
        }), 200

    except Exception as err:
        print(f"❌ admin_get_registrations error: {err}")
        return jsonify({"error": "Failed to fetch registrations."}), 500


# 5b. Admin: Delete Registration Record
@admin_bp.route("/api/admin/registrations/<submission_id>", methods=["DELETE"])
@admin_required
def admin_delete_registration(current_user, submission_id):
    try:
        if db is not None:
            result = db.registrations.delete_one({"submissionId": submission_id})
            if result.deleted_count == 0:
                return jsonify({"error": f"Registration '{submission_id}' not found."}), 404

        global LOCAL_REGISTRATIONS
        LOCAL_REGISTRATIONS = [r for r in LOCAL_REGISTRATIONS if r.get("submissionId") != submission_id]

        return jsonify({
            "success": True,
            "message": f"Registration '{submission_id}' deleted successfully."
        }), 200

    except Exception as err:
        print(f"❌ admin_delete_registration error: {err}")
        return jsonify({"error": "Failed to delete registration."}), 500


# 5c. Admin: Ban / Suspend or Update Registration Status
@admin_bp.route("/api/admin/registrations/<submission_id>/status", methods=["PUT", "POST"])
@admin_required
def admin_update_registration_status(current_user, submission_id):
    try:
        data = request.get_json() or {}
        new_status = (data.get("status") or "CONFIRMED").upper().strip()

        if db is not None:
            matched_reg = db.registrations.find_one({"submissionId": submission_id})
            if matched_reg:
                user_id = matched_reg.get("userId")
                if user_id:
                    db.registrations.update_many({"userId": user_id}, {"$set": {"status": new_status}})
                else:
                    db.registrations.update_many({"submissionId": submission_id}, {"$set": {"status": new_status}})
            else:
                db.registrations.update_many({"submissionId": submission_id}, {"$set": {"status": new_status}})

        for r in LOCAL_REGISTRATIONS:
            if r.get("submissionId") == submission_id:
                user_id = r.get("userId")
                if user_id:
                    for r2 in LOCAL_REGISTRATIONS:
                        if r2.get("userId") == user_id:
                            r2["status"] = new_status
                else:
                    r["status"] = new_status

        return jsonify({
            "success": True,
            "submissionId": submission_id,
            "newStatus": new_status,
            "message": f"Status updated to '{new_status}' for '{submission_id}'."
        }), 200

    except Exception as err:
        print(f"❌ admin_update_registration_status error: {err}")
        return jsonify({"error": "Failed to update registration status."}), 500


# 5e. Admin: Create or Update Event Details & Schedule
@admin_bp.route("/api/admin/events/<event_id>", methods=["PUT", "POST"])
@admin_bp.route("/api/admin/events", methods=["POST"])
@admin_required
def admin_save_event(current_user, event_id=None):
    try:
        data = request.get_json() or {}
        target_id = event_id or data.get("id")

        if not target_id:
            return jsonify({"error": "Event ID is required"}), 400

        payload = {
            "id": target_id,
            "number": data.get("number") or "EVENT",
            "title": data.get("title", ""),
            "tagline": data.get("tagline", ""),
            "description": data.get("description", ""),
            "format": data.get("format", ""),
            "duration": data.get("duration", ""),
            "startDate": data.get("startDate", ""),
            "endDate": data.get("endDate", ""),
            "isoStartDate": data.get("isoStartDate", ""),
            "isoEndDate": data.get("isoEndDate", ""),
            "prizePool": data.get("prizePool", "₹0"),
            "prizeAmountNumeric": int(data.get("prizeAmountNumeric") or 0),
            "registrationOpen": bool(data.get("registrationOpen", True)),
            "isOnline": bool(data.get("isOnline", True)),
            "status": data.get("status") or "ACTIVE",
            "updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

        if db is not None:
            db.events.update_one({"id": target_id}, {"$set": payload}, upsert=True)

        found = False
        for i, ev in enumerate(LOCAL_EVENTS):
            if ev.get("id") == target_id:
                LOCAL_EVENTS[i].update(payload)
                found = True
                break
        if not found:
            LOCAL_EVENTS.append(payload)

        return jsonify({
            "success": True,
            "event": payload,
            "message": f"Event '{payload.get('title')}' saved successfully in HiveMind Central Registry."
        }), 200

    except Exception as err:
        print(f"❌ admin_save_event error: {err}")
        return jsonify({"error": "Failed to save event."}), 500


# 6. Admin: Export Registrations Data to CSV / Excel Spreadsheet
@admin_bp.route("/api/admin/export", methods=["GET"])
@admin_bp.route("/api/admin/export/excel", methods=["GET"])
@admin_required
def admin_export_data(current_user):
    try:
        event_filter = request.args.get("event") or ""
        export_format = (request.args.get("format") or "").lower()
        is_excel = "excel" in request.path or export_format == "excel" or export_format == "xlsx"

        regs = []
        if db is not None:
            pipeline = [
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "userId",
                        "foreignField": "_id",
                        "as": "user"
                    }
                },
                {"$unwind": {"path": "$user", "preserveNullAndEmptyArrays": True}},
                {
                    "$addFields": {
                        "name": "$user.name",
                        "emailId": "$user.emailId",
                        "collegeEmailId": "$user.collegeEmailId",
                        "regNo": "$user.regNo",
                        "trade": "$user.trade",
                        "phoneNumber": "$user.phoneNumber",
                        "college": "$user.college",
                        "degree": "$user.degree",
                        "batchYear": "$user.batchYear"
                    }
                },
                {"$project": {"user": 0, "userId": 0, "_id": 0}}
            ]
            
            match_stage = {}
            if event_filter and event_filter != "ALL":
                match_stage["selectedEvent"] = {"$regex": _safe_regex(event_filter), "$options": "i"}
            if match_stage:
                pipeline.append({"$match": match_stage})
                
            pipeline.append({"$sort": {"registeredAt": -1}})
            cursor = db.registrations.aggregate(pipeline)
            regs = list(cursor)
        else:
            for r in LOCAL_REGISTRATIONS:
                if event_filter and event_filter != "ALL" and event_filter.lower() not in r.get("selectedEvent", "").lower():
                    continue
                regs.append(r)
            regs.sort(key=lambda x: x.get("registeredAt", ""), reverse=True)

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
            wb = openpyxl.Workbook()
            ws = wb.active
            ws.title = "Registrations"
            
            # Header row
            ws.append(headers)
            
            # Data rows
            for r in regs:
                ws.append([
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
                
            output = io.BytesIO()
            wb.save(output)
            output.seek(0)
            
            filename = f"HiveMind_Registrations_{_safe_regex(event_filter) or 'ALL'}_{datetime.date.today().strftime('%Y%m%d')}.xlsx"
            return send_file(
                output,
                mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                as_attachment=True,
                download_name=filename
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

            filename = f"HiveMind_Registrations_{_safe_regex(event_filter) or 'ALL'}_{datetime.date.today().strftime('%Y%m%d')}.csv"
            return Response(
                output.getvalue(),
                mimetype="text/csv",
                headers={"Content-disposition": f"attachment; filename={filename}"}
            )

    except Exception as err:
        print(f"❌ admin_export_data error: {err}")
        return jsonify({"error": "Failed to export data."}), 500


# 7. Admin: Publish & Update Event Results / Winners in MongoDB Atlas
@admin_bp.route("/api/admin/results", methods=["POST"])
@admin_required
def admin_publish_results(current_user):
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
            "publishedAt": datetime.datetime.now(datetime.timezone.utc).isoformat()
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
        print(f"❌ admin_publish_results error: {err}")
        return jsonify({"error": "Failed to publish results."}), 500


# 9. Admin: Post & Publish Official Notices / Event News to MongoDB Atlas
@admin_bp.route("/api/admin/notices", methods=["POST"])
@admin_required
def admin_publish_notice(current_user):
    try:
        data = request.get_json() or {}
        title = (data.get("title") or "").strip()
        category = (data.get("category") or "GENERAL NOTICE").strip()
        target_event = (data.get("targetEvent") or "ALL EVENTS").strip()
        content = (data.get("content") or "").strip()
        priority = (data.get("priority") or "NORMAL").strip().upper()

        if not title or not content:
            return jsonify({"error": "Title and Content are required for a Notice"}), 400

        notice_id = f"NOTICE-{uuid.uuid4().hex[:8].upper()}"
        notice_doc = {
            "noticeId": notice_id,
            "title": title,
            "category": category,
            "targetEvent": target_event,
            "content": content,
            "priority": priority,
            "publishedAt": datetime.datetime.now(datetime.timezone.utc).isoformat()
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
        print(f"❌ admin_publish_notice error: {err}")
        return jsonify({"error": "Failed to publish notice."}), 500


# 10. Admin: Delete a Published Notice
@admin_bp.route("/api/admin/notices/<notice_id>", methods=["DELETE"])
@admin_required
def admin_delete_notice(current_user, notice_id):
    try:
        if db is not None:
            db.notices.delete_one({"noticeId": notice_id})
        else:
            global LOCAL_NOTICES
            LOCAL_NOTICES = [n for n in LOCAL_NOTICES if n.get("noticeId") != notice_id]

        return jsonify({"success": True, "message": f"Notice {notice_id} deleted."}), 200

    except Exception as err:
        print(f"❌ admin_delete_notice error: {err}")
        return jsonify({"error": "Failed to delete notice."}), 500
