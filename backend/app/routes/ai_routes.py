from flask import Blueprint, request
from utils.response import api_success, api_error
from models.database import db_manager
from middleware.auth_middleware import require_auth
from services.ai_matching import compute_opportunity_match
from services.skill_gap import analyze_skill_gap
from services.career_gps import generate_learning_roadmap
from services.readiness_simulator import calculate_career_readiness
from services.career_assistant import ask_career_assistant

ai_bp = Blueprint("ai_bp", __name__)

@ai_bp.route("/match", methods=["POST"])
@require_auth
def calculate_match():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    data = request.get_json(silent=True) or {}
    
    opp_id = data.get("opportunity_id")
    if not opp_id:
        return api_error("opportunity_id is required", "VALIDATION_MISSING_ID", 400)
        
    opp = db_manager.opportunities.find_one({"$or": [{"_id": opp_id}, {"id": opp_id}]})
    if not opp:
        return api_error("Opportunity not found", "NOT_FOUND", 404)
        
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]}) or {}
    result = compute_opportunity_match(profile, opp)
    return api_success(result, "Match calculated successfully")

@ai_bp.route("/recommendations", methods=["GET"])
@require_auth
def get_recommendations():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]}) or {}
    all_opps = list(db_manager.opportunities.find({}))
    
    scored = []
    for opp in all_opps:
        match_info = compute_opportunity_match(profile, opp)
        scored.append({
            **opp,
            "match_details": match_info,
            "match_score": match_info["match_score"]
        })
        
    # Sort descending by match score
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return api_success(scored, "AI Opportunity recommendations retrieved successfully")

@ai_bp.route("/skill-gap", methods=["POST"])
@require_auth
def get_skill_gap():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    data = request.get_json(silent=True) or {}
    
    target_skills = data.get("target_skills")
    opp_id = data.get("opportunity_id")
    custom_proficiencies = data.get("custom_proficiencies")
    
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]}) or {}
    
    if opp_id and not target_skills:
        opp = db_manager.opportunities.find_one({"$or": [{"_id": opp_id}, {"id": opp_id}]})
        if opp:
            target_skills = opp.get("required_skills", [])
            
    if not target_skills:
        target_skills = ["Python", "SQL", "React.js", "Docker", "Data Structures & Algorithms"]
        
    result = analyze_skill_gap(profile, target_skills, custom_proficiencies)
    return api_success(result, "Skill gap analysis generated successfully")

@ai_bp.route("/roadmap", methods=["POST"])
@require_auth
def get_roadmap():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    data = request.get_json(silent=True) or {}
    
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]}) or {}
    target_role = data.get("target_role") or (profile.get("preferred_job_roles") or ["Full Stack Developer"])[0]
    missing_skills = data.get("missing_skills", [])
    
    roadmap = generate_learning_roadmap(target_role, missing_skills, profile.get("skills", []))
    return api_success(roadmap, "Personalized Career GPS roadmap generated successfully")

@ai_bp.route("/readiness", methods=["GET"])
@require_auth
def get_readiness():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]}) or {}
    result = calculate_career_readiness(profile)
    return api_success(result, "Career readiness score retrieved successfully")

@ai_bp.route("/simulate-readiness", methods=["POST"])
@require_auth
def simulate_readiness():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    data = request.get_json(silent=True) or {}
    
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]}) or {}
    simulated_additions = {
        "skills": data.get("simulated_skills", []),
        "projects_count": int(data.get("simulated_projects_count", 0)),
        "certifications_count": int(data.get("simulated_certifications_count", 0)),
        "learning_progress_boost": int(data.get("simulated_learning_boost", 0))
    }
    
    current_readiness = calculate_career_readiness(profile)
    simulated_readiness = calculate_career_readiness(profile, simulated_additions)
    
    return api_success({
        "current": current_readiness,
        "simulated": simulated_readiness,
        "score_gain": simulated_readiness["score"] - current_readiness["score"],
        "simulated_inputs": simulated_additions
    }, "Readiness simulation completed successfully")

@ai_bp.route("/career-assistant", methods=["POST"])
@require_auth
def chat_assistant():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    data = request.get_json(silent=True) or {}
    
    message = data.get("message", "").strip()
    if not message:
        return api_error("Message cannot be empty", "VALIDATION_EMPTY_MESSAGE", 400)
        
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]}) or {}
    response = ask_career_assistant(profile, message)
    return api_success(response, "Response generated successfully")
