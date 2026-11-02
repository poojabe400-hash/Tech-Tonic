import uuid
from datetime import datetime, timezone
from flask import Blueprint, request
from utils.response import api_success, api_error
from models.database import db_manager
from middleware.auth_middleware import require_admin

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/dashboard", methods=["GET"])
@require_admin
def admin_dashboard():
    # Platform statistics
    total_students = db_manager.users.count_documents({"role": "student"})
    total_opps = db_manager.opportunities.count_documents()
    total_events = db_manager.events.count_documents()
    total_applications = db_manager.applications.count_documents()
    total_scholarships = db_manager.scholarships.count_documents()
    total_resources = db_manager.learning_resources.count_documents()
    
    # Recent student activity
    recent_students = list(db_manager.student_profiles.find({}, limit=5, sort=[("created_at", -1)]))
    recent_applications = list(db_manager.applications.find({}, limit=5, sort=[("applied_date", -1)]))
    
    return api_success({
        "stats": {
            "total_students": total_students,
            "total_opportunities": total_opps,
            "total_events": total_events,
            "total_applications": total_applications,
            "total_scholarships": total_scholarships,
            "total_resources": total_resources
        },
        "recent_students": recent_students,
        "recent_applications": recent_applications
    }, "Admin dashboard statistics retrieved successfully")

@admin_bp.route("/opportunities", methods=["POST"])
@require_admin
def add_opportunity():
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    company = data.get("company")
    if not title or not company:
        return api_error("Title and Company are required.", "VALIDATION_ERROR", 400)
        
    opp_doc = {
        "_id": str(uuid.uuid4()),
        "title": title,
        "company": company,
        "type": data.get("type", "internship"),
        "mode": data.get("mode", "remote"),
        "location": data.get("location", "Remote"),
        "category": data.get("category", "Software Engineering"),
        "stipend": data.get("stipend", "Competitive"),
        "experience_level": data.get("experience_level", "beginner"),
        "is_paid": data.get("is_paid", True),
        "required_skills": data.get("required_skills", []),
        "eligibility": data.get("eligibility", "Open to all students"),
        "description": data.get("description", ""),
        "deadline": data.get("deadline", "2026-12-31"),
        "source": data.get("source", "Admin Verified Listing"),
        "last_verified": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "apply_url": data.get("apply_url") or None,
        "is_beginner_friendly": data.get("is_beginner_friendly", True),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db_manager.opportunities.insert_one(opp_doc)
    return api_success(opp_doc, "Opportunity created successfully", 201)

@admin_bp.route("/opportunities/<opp_id>", methods=["PUT"])
@require_admin
def update_opportunity(opp_id):
    data = request.get_json(silent=True) or {}
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    data["last_verified"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    db_manager.opportunities.update_one({"$or": [{"_id": opp_id}, {"id": opp_id}]}, {"$set": data})
    updated = db_manager.opportunities.find_one({"$or": [{"_id": opp_id}, {"id": opp_id}]})
    return api_success(updated, "Opportunity updated successfully")

@admin_bp.route("/opportunities/<opp_id>", methods=["DELETE"])
@require_admin
def delete_opportunity(opp_id):
    res = db_manager.opportunities.delete_one({"$or": [{"_id": opp_id}, {"id": opp_id}]})
    if res.deleted_count == 0:
        return api_error("Opportunity not found", "NOT_FOUND", 404)
    return api_success({}, "Opportunity removed successfully")

@admin_bp.route("/events", methods=["POST"])
@require_admin
def add_event():
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    if not title:
        return api_error("Title is required", "VALIDATION_ERROR", 400)
        
    event_doc = {
        "_id": str(uuid.uuid4()),
        "title": title,
        "organizer": data.get("organizer", "Tech Community"),
        "category": data.get("category", "Hackathon"),
        "format": data.get("format", "Online"),
        "location": data.get("location", "Virtual"),
        "start_date": data.get("start_date", "2026-11-20"),
        "end_date": data.get("end_date", "2026-11-22"),
        "registration_deadline": data.get("registration_deadline", "2026-11-15"),
        "eligibility": data.get("eligibility", "College students"),
        "fee": data.get("fee", "Free"),
        "description": data.get("description", ""),
        "registration_url": data.get("registration_url") or None,
        "status": data.get("status", "Registration Open"),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db_manager.events.insert_one(event_doc)
    return api_success(event_doc, "Event added successfully", 201)

@admin_bp.route("/events/<event_id>", methods=["PUT"])
@require_admin
def update_event(event_id):
    data = request.get_json(silent=True) or {}
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    db_manager.events.update_one({"$or": [{"_id": event_id}, {"id": event_id}]}, {"$set": data})
    updated = db_manager.events.find_one({"$or": [{"_id": event_id}, {"id": event_id}]})
    return api_success(updated, "Event updated successfully")

@admin_bp.route("/events/<event_id>", methods=["DELETE"])
@require_admin
def delete_event(event_id):
    res = db_manager.events.delete_one({"$or": [{"_id": event_id}, {"id": event_id}]})
    if res.deleted_count == 0:
        return api_error("Event not found", "NOT_FOUND", 404)
    return api_success({}, "Event removed successfully")

@admin_bp.route("/reports", methods=["GET"])
@require_admin
def list_reports():
    # Reports on incorrect listings or platform feedback
    mock_reports = [
        {"id": "rep-1", "type": "listing_correction", "item_title": "Nexus Innovations (Demo)", "reported_by": "student@demo.com", "issue": "Deadline updated by organizer on social page.", "status": "Reviewed"},
        {"id": "rep-2", "type": "broken_link", "item_title": "CS50 Introduction", "reported_by": "aarav@demo.com", "issue": "Course syllabus link moved to new session.", "status": "Resolved"}
    ]
    return api_success(mock_reports, "Moderation reports fetched successfully")
