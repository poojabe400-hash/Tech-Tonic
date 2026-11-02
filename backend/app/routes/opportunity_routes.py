import uuid
from datetime import datetime, timezone
from flask import Blueprint, request
from utils.response import api_success, api_error
from models.database import db_manager
from middleware.auth_middleware import require_auth
from services.ai_matching import compute_opportunity_match

opps_bp = Blueprint("opps_bp", __name__)

@opps_bp.route("", methods=["GET"])
def list_opportunities():
    """
    Search and filter verified opportunities (jobs, internships).
    Supports pagination, keyword search, type, mode, skills, and beginner filters.
    """
    search = request.args.get("search", "").strip()
    opp_type = request.args.get("type", "").strip().lower()
    mode = request.args.get("mode", "").strip().lower()
    location = request.args.get("location", "").strip().lower()
    skill_filter = request.args.get("skill", "").strip()
    experience = request.args.get("experience_level", "").strip().lower()
    beginner_only = request.args.get("beginner_friendly", "").lower() in ("true", "1")
    page = max(1, int(request.args.get("page", 1)))
    limit = min(50, max(1, int(request.args.get("limit", 12))))
    
    query = {}
    if opp_type and opp_type != "all":
        query["type"] = opp_type
    if mode and mode != "all":
        query["mode"] = mode
    if beginner_only:
        query["is_beginner_friendly"] = True
    if experience and experience != "all":
        query["experience_level"] = experience
        
    all_items = list(db_manager.opportunities.find(query))
    
    # Filter in memory for regex or complex search
    filtered = []
    for item in all_items:
        match = True
        if search:
            search_corpus = f"{item.get('title', '')} {item.get('company', '')} {item.get('description', '')} {' '.join(item.get('required_skills', []))}".lower()
            if search.lower() not in search_corpus:
                match = False
        if location and location not in str(item.get("location", "")).lower():
            match = False
        if skill_filter and skill_filter.lower() not in [s.lower() for s in item.get("required_skills", [])]:
            match = False
            
        if match:
            filtered.append(item)
            
    total_count = len(filtered)
    skip = (page - 1) * limit
    paginated = filtered[skip:skip + limit]
    
    return api_success({
        "items": paginated,
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": (total_count + limit - 1) // limit if limit else 1
    }, "Opportunities retrieved successfully")

@opps_bp.route("/<opp_id>", methods=["GET"])
def get_opportunity(opp_id):
    opp = db_manager.opportunities.find_one({"$or": [{"_id": opp_id}, {"id": opp_id}]})
    if not opp:
        return api_error("Opportunity not found", "NOT_FOUND", 404)
        
    # Check if student is logged in to attach match score
    match_data = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        from middleware.auth_middleware import verify_token
        user_identity = verify_token(token)
        if user_identity:
            profile = db_manager.student_profiles.find_one({"$or": [{"user_id": user_identity["uid"]}, {"email": user_identity["email"]}]})
            if profile:
                match_data = compute_opportunity_match(profile, opp)
                
    result = dict(opp)
    if match_data:
        result["match_analysis"] = match_data
        
    return api_success(result, "Opportunity retrieved successfully")

@opps_bp.route("/save", methods=["POST"])
@require_auth
def save_opportunity():
    uid = request.current_user["uid"]
    data = request.get_json(silent=True) or {}
    opp_id = data.get("opportunity_id")
    
    if not opp_id:
        return api_error("opportunity_id is required", "VALIDATION_MISSING_ID", 400)
        
    opp = db_manager.opportunities.find_one({"$or": [{"_id": opp_id}, {"id": opp_id}]})
    if not opp:
        return api_error("Opportunity not found", "NOT_FOUND", 404)
        
    # Check if already saved
    existing = db_manager.saved_opportunities.find_one({"user_id": uid, "opportunity_id": opp_id})
    if existing:
        return api_success(existing, "Opportunity is already saved in your shortlist")
        
    record = {
        "_id": str(uuid.uuid4()),
        "user_id": uid,
        "opportunity_id": opp_id,
        "title": opp.get("title"),
        "company": opp.get("company"),
        "type": opp.get("type"),
        "mode": opp.get("mode"),
        "location": opp.get("location"),
        "deadline": opp.get("deadline"),
        "saved_at": datetime.now(timezone.utc).isoformat()
    }
    db_manager.saved_opportunities.insert_one(record)
    
    return api_success(record, "Opportunity saved to your shortlist", 201)

@opps_bp.route("/saved", methods=["GET"])
@require_auth
def list_saved_opportunities():
    uid = request.current_user["uid"]
    saved = list(db_manager.saved_opportunities.find({"user_id": uid}, sort=[("saved_at", -1)]))
    return api_success(saved, "Saved opportunities fetched successfully")

@opps_bp.route("/saved/<save_id>", methods=["DELETE"])
@require_auth
def remove_saved_opportunity(save_id):
    uid = request.current_user["uid"]
    res = db_manager.saved_opportunities.delete_one({"user_id": uid, "$or": [{"_id": save_id}, {"opportunity_id": save_id}]})
    if res.deleted_count == 0:
        return api_error("Saved record not found", "NOT_FOUND", 404)
    return api_success({}, "Opportunity removed from saved shortlist")
