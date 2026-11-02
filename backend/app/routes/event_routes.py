import uuid
from datetime import datetime, timezone
from flask import Blueprint, request
from utils.response import api_success, api_error
from models.database import db_manager
from middleware.auth_middleware import require_auth

events_bp = Blueprint("events_bp", __name__)

@events_bp.route("", methods=["GET"])
def list_events():
    search = request.args.get("search", "").strip()
    category = request.args.get("category", "").strip()
    format_type = request.args.get("format", "").strip().lower()
    location = request.args.get("location", "").strip().lower()
    sort_by = request.args.get("sort_by", "deadline").strip()
    page = max(1, int(request.args.get("page", 1)))
    limit = min(50, max(1, int(request.args.get("limit", 12))))
    
    query = {}
    if category and category != "all":
        query["category"] = category
    if format_type and format_type != "all":
        if format_type == "online":
            query["format"] = "Online"
        elif format_type == "in-person" or format_type == "offline":
            query["format"] = "In-Person"
        elif format_type == "hybrid":
            query["format"] = "Hybrid"
            
    all_events = list(db_manager.events.find(query))
    
    # Filter search and location in memory
    filtered = []
    for ev in all_events:
        match = True
        if search:
            search_str = f"{ev.get('title', '')} {ev.get('organizer', '')} {ev.get('description', '')} {ev.get('category', '')}".lower()
            if search.lower() not in search_str:
                match = False
        if location and location not in str(ev.get("location", "")).lower():
            match = False
        if match:
            filtered.append(ev)
            
    # Sort
    if sort_by == "deadline":
        filtered.sort(key=lambda x: str(x.get("registration_deadline", "")))
    elif sort_by == "start_date":
        filtered.sort(key=lambda x: str(x.get("start_date", "")))
    elif sort_by == "title":
        filtered.sort(key=lambda x: str(x.get("title", "")).lower())
        
    total_count = len(filtered)
    skip = (page - 1) * limit
    paginated = filtered[skip:skip + limit]
    
    return api_success({
        "items": paginated,
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": (total_count + limit - 1) // limit if limit else 1
    }, "Events retrieved successfully")

@events_bp.route("/upcoming", methods=["GET"])
def get_upcoming_events():
    limit = min(20, max(1, int(request.args.get("limit", 6))))
    events = list(db_manager.events.find({}, limit=limit, sort=[("registration_deadline", 1)]))
    return api_success(events, "Upcoming events retrieved successfully")

@events_bp.route("/<event_id>", methods=["GET"])
def get_event(event_id):
    ev = db_manager.events.find_one({"$or": [{"_id": event_id}, {"id": event_id}]})
    if not ev:
        return api_error("Event not found", "NOT_FOUND", 404)
    return api_success(ev, "Event details retrieved successfully")

@events_bp.route("/save", methods=["POST"])
@require_auth
def save_event():
    uid = request.current_user["uid"]
    data = request.get_json(silent=True) or {}
    event_id = data.get("event_id")
    
    if not event_id:
        return api_error("event_id is required", "VALIDATION_MISSING_ID", 400)
        
    ev = db_manager.events.find_one({"$or": [{"_id": event_id}, {"id": event_id}]})
    if not ev:
        return api_error("Event not found", "NOT_FOUND", 404)
        
    existing = db_manager.saved_events.find_one({"user_id": uid, "event_id": event_id})
    if existing:
        return api_success(existing, "Event is already saved in My Events")
        
    record = {
        "_id": str(uuid.uuid4()),
        "user_id": uid,
        "event_id": event_id,
        "title": ev.get("title"),
        "organizer": ev.get("organizer"),
        "category": ev.get("category"),
        "format": ev.get("format"),
        "start_date": ev.get("start_date"),
        "end_date": ev.get("end_date"),
        "registration_deadline": ev.get("registration_deadline"),
        "registration_url": ev.get("registration_url"),
        "status": "Saved / Planning to Attend",
        "saved_at": datetime.now(timezone.utc).isoformat()
    }
    db_manager.saved_events.insert_one(record)
    
    return api_success(record, "Event added to My Events", 201)

@events_bp.route("/saved", methods=["GET"])
@require_auth
def list_saved_events():
    uid = request.current_user["uid"]
    saved = list(db_manager.saved_events.find({"user_id": uid}, sort=[("saved_at", -1)]))
    return api_success(saved, "Saved events fetched successfully")

@events_bp.route("/saved/<save_id>", methods=["DELETE"])
@require_auth
def remove_saved_event(save_id):
    uid = request.current_user["uid"]
    res = db_manager.saved_events.delete_one({"user_id": uid, "$or": [{"_id": save_id}, {"event_id": save_id}]})
    if res.deleted_count == 0:
        return api_error("Saved event record not found", "NOT_FOUND", 404)
    return api_success({}, "Event removed from My Events")
