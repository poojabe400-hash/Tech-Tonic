import uuid
from datetime import datetime, timezone
from flask import Blueprint, request
from utils.response import api_success, api_error
from models.database import db_manager
from middleware.auth_middleware import require_auth

app_bp = Blueprint("app_bp", __name__)

VALID_STATUSES = ["Saved", "Applied", "Under Review", "Interview", "Selected", "Rejected", "Withdrawn"]

@app_bp.route("", methods=["GET"])
@require_auth
def list_applications():
    uid = request.current_user["uid"]
    status_filter = request.args.get("status")
    
    query = {"user_id": uid}
    if status_filter and status_filter != "all":
        query["status"] = status_filter
        
    applications = list(db_manager.applications.find(query, sort=[("applied_date", -1)]))
    return api_success(applications, "Applications retrieved successfully")

@app_bp.route("", methods=["POST"])
@require_auth
def create_application():
    uid = request.current_user["uid"]
    data = request.get_json(silent=True) or {}
    
    title = data.get("title")
    company = data.get("company")
    if not title or not company:
        return api_error("Title and Company are required.", "VALIDATION_ERROR", 400)
        
    status = data.get("status", "Applied")
    if status not in VALID_STATUSES:
        status = "Applied"
        
    now_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    app_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": uid,
        "opportunity_id": data.get("opportunity_id"),
        "title": title,
        "company": company,
        "type": data.get("type", "internship"),
        "status": status,
        "applied_date": data.get("applied_date") or now_date,
        "notes": data.get("notes", ""),
        "next_deadline": data.get("next_deadline"),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    db_manager.applications.insert_one(app_doc)
    
    # In-app notification
    db_manager.notifications.insert_one({
        "user_id": uid,
        "title": f"Application Tracked: {company}",
        "message": f"Added application for '{title}' at {company} to your tracker (Status: {status}).",
        "category": "application",
        "is_read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return api_success(app_doc, "Application created successfully", 201)

@app_bp.route("/<app_id>", methods=["PUT"])
@require_auth
def update_application(app_id):
    uid = request.current_user["uid"]
    data = request.get_json(silent=True) or {}
    
    app_record = db_manager.applications.find_one({"_id": app_id, "user_id": uid})
    if not app_record:
        return api_error("Application record not found or unauthorized.", "NOT_FOUND", 404)
        
    update_doc = {}
    if "status" in data:
        if data["status"] in VALID_STATUSES:
            update_doc["status"] = data["status"]
            # Notify user of milestone
            if data["status"] in ["Interview", "Selected"]:
                db_manager.notifications.insert_one({
                    "user_id": uid,
                    "title": f"🎉 Status Update: {app_record.get('company')}",
                    "message": f"Congratulations! Your application for '{app_record.get('title')}' is now '{data['status']}'.",
                    "category": "application",
                    "is_read": False,
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
    if "notes" in data:
        update_doc["notes"] = data["notes"]
    if "next_deadline" in data:
        update_doc["next_deadline"] = data["next_deadline"]
        
    update_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    db_manager.applications.update_one({"_id": app_id, "user_id": uid}, {"$set": update_doc})
    updated = db_manager.applications.find_one({"_id": app_id, "user_id": uid})
    return api_success(updated, "Application updated successfully")

@app_bp.route("/<app_id>", methods=["DELETE"])
@require_auth
def delete_application(app_id):
    uid = request.current_user["uid"]
    res = db_manager.applications.delete_one({"_id": app_id, "user_id": uid})
    if res.deleted_count == 0:
        return api_error("Application record not found", "NOT_FOUND", 404)
    return api_success({}, "Application deleted successfully")
