from datetime import datetime, timezone
from flask import Blueprint, request
from utils.response import api_success, api_error
from models.database import db_manager
from middleware.auth_middleware import require_auth
from services.readiness_simulator import calculate_career_readiness
from services.ai_matching import compute_opportunity_match
from services.career_gps import generate_learning_roadmap

student_bp = Blueprint("student_bp", __name__)

@student_bp.route("/profile", methods=["GET"])
@require_auth
def get_profile():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]})
    if not profile:
        # Create initial profile if missing
        profile = {
            "user_id": uid,
            "email": email,
            "full_name": request.current_user.get("name", "Student"),
            "college": "",
            "degree": "B.Tech",
            "branch": "Computer Science",
            "current_semester": "1st Semester",
            "graduation_year": "2026",
            "skills": ["Python"],
            "technical_skills": ["Python"],
            "soft_skills": [],
            "projects": [],
            "certifications": [],
            "areas_of_interest": ["Software Development"],
            "preferred_job_roles": ["Software Engineering Intern"],
            "preferred_work_mode": "remote",
            "learning_progress_pct": 10,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db_manager.student_profiles.insert_one(profile)
        
    return api_success(profile, "Profile retrieved successfully")

@student_bp.route("/profile", methods=["PUT"])
@require_auth
def update_profile():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    data = request.get_json(silent=True) or {}
    
    # Restrict allowed editable fields
    allowed_fields = [
        "full_name", "college", "degree", "branch", "current_semester", "graduation_year",
        "skills", "technical_skills", "programming_languages", "soft_skills",
        "projects", "certifications", "areas_of_interest", "preferred_job_roles",
        "preferred_work_mode", "preferred_location", "career_goals",
        "linkedin_url", "github_url", "portfolio_url", "skill_proficiencies"
    ]
    
    update_doc = {}
    for field in allowed_fields:
        if field in data:
            update_doc[field] = data[field]
            
    # Keep skills and technical_skills synchronized
    if "skills" in update_doc and "technical_skills" not in update_doc:
        update_doc["technical_skills"] = update_doc["skills"]
    elif "technical_skills" in update_doc and "skills" not in update_doc:
        update_doc["skills"] = update_doc["technical_skills"]
        
    update_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    db_manager.student_profiles.update_one(
        {"$or": [{"user_id": uid}, {"email": email}]},
        {"$set": update_doc},
        upsert=True
    )
    
    updated_profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]})
    return api_success(updated_profile, "Profile updated successfully")

@student_bp.route("/dashboard", methods=["GET"])
@require_auth
def get_dashboard():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]})
    if not profile:
        profile = {
            "user_id": uid,
            "email": email,
            "full_name": request.current_user.get("name", "Student"),
            "skills": ["Python"],
            "projects": [],
            "certifications": []
        }
        
    # 1. Career Readiness Score
    readiness = calculate_career_readiness(profile)
    
    # 2. Recommended Opportunities (Top 3)
    all_opps = list(db_manager.opportunities.find({}, limit=20))
    scored_opps = []
    for opp in all_opps:
        match_info = compute_opportunity_match(profile, opp)
        scored_opps.append({
            **opp,
            "match_score": match_info["match_score"],
            "matched_skills": match_info["matched_skills"],
            "missing_skills": match_info["missing_skills"],
            "why_matched": match_info["why_matched"]
        })
    scored_opps.sort(key=lambda x: x["match_score"], reverse=True)
    top_recommended = scored_opps[:3]
    total_recommended_count = len([o for o in scored_opps if o["match_score"] >= 60])
    
    # 3. Upcoming Events (Top 3 nearest)
    upcoming_events = list(db_manager.events.find({}, limit=3, sort=[("start_date", 1)]))
    
    # 4. Applications and Saved Opportunities
    saved_opps = list(db_manager.saved_opportunities.find({"user_id": uid}))
    saved_events = list(db_manager.saved_events.find({"user_id": uid}))
    applications = list(db_manager.applications.find({"user_id": uid}))
    
    # Count statuses
    app_stats = {
        "total": len(applications),
        "under_review": sum(1 for a in applications if a.get("status") == "Under Review"),
        "interview": sum(1 for a in applications if a.get("status") == "Interview"),
        "selected": sum(1 for a in applications if a.get("status") == "Selected"),
        "applied": sum(1 for a in applications if a.get("status") in ["Applied", "Under Review", "Interview"])
    }
    
    # 5. Roadmap preview
    target_role = (profile.get("preferred_job_roles") or ["Full Stack Developer"])[0]
    missing_for_top = top_recommended[0]["missing_skills"] if top_recommended else []
    roadmap = generate_learning_roadmap(target_role, missing_for_top, profile.get("skills", []))
    
    # Profile completion calculation
    profile_keys = ["college", "degree", "branch", "graduation_year", "skills", "projects", "certifications", "github_url", "linkedin_url"]
    filled = sum(1 for k in profile_keys if profile.get(k))
    profile_completion_pct = round((filled / len(profile_keys)) * 100)
    
    return api_success({
        "student_name": profile.get("full_name") or request.current_user.get("name", "Student"),
        "email": email,
        "profile_completion_pct": profile_completion_pct,
        "readiness": readiness,
        "total_recommended_count": total_recommended_count,
        "top_recommended_opportunities": top_recommended,
        "upcoming_events": upcoming_events,
        "saved_opportunities_count": len(saved_opps),
        "saved_events_count": len(saved_events),
        "applications_stats": app_stats,
        "roadmap_preview": {
            "target_role": target_role,
            "current_week": 1,
            "week_title": roadmap["weeks"][0]["title"],
            "tasks": roadmap["weeks"][0]["tasks"],
            "progress_pct": profile.get("learning_progress_pct", 25)
        }
    }, "Dashboard data fetched successfully")
