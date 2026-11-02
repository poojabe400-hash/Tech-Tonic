import os
import uuid
from datetime import datetime, timezone
from werkzeug.utils import secure_filename
from flask import Blueprint, request
from utils.response import api_success, api_error
from config.settings import config
from models.database import db_manager
from middleware.auth_middleware import require_auth
from services.resume_analyzer import extract_text_from_pdf, parse_resume_content

resume_bp = Blueprint("resume_bp", __name__)

@resume_bp.route("/upload", methods=["POST"])
@require_auth
def upload_resume():
    uid = request.current_user["uid"]
    
    if "resume" not in request.files:
        return api_error("No resume file uploaded. Form field must be named 'resume'.", "RESUME_NO_FILE", 400)
        
    file = request.files["resume"]
    if file.filename == "":
        return api_error("No selected file.", "RESUME_EMPTY_FILENAME", 400)
        
    # Check extension
    filename = secure_filename(file.filename)
    if not filename.lower().endswith(".pdf"):
        return api_error("Only PDF resume files (.pdf) are supported.", "RESUME_INVALID_FILE_TYPE", 415)
        
    # Ensure upload folder exists
    user_upload_dir = os.path.join(config.UPLOAD_FOLDER, secure_filename(str(uid)))
    os.makedirs(user_upload_dir, exist_ok=True)
    
    unique_filename = f"{uuid.uuid4()}_{filename}"
    saved_path = os.path.join(user_upload_dir, unique_filename)
    file.save(saved_path)
    
    # Check file size (max 10MB)
    file_size = os.path.getsize(saved_path)
    if file_size > 10 * 1024 * 1024:
        os.remove(saved_path)
        return api_error("File size exceeds 10MB limit.", "RESUME_FILE_TOO_LARGE", 413)
        
    # Extract text using PyPDF2
    raw_text = extract_text_from_pdf(saved_path)
    analysis = parse_resume_content(raw_text)
    
    # Save record to resumes collection
    resume_id = str(uuid.uuid4())
    resume_doc = {
        "_id": resume_id,
        "user_id": uid,
        "filename": filename,
        "stored_filename": unique_filename,
        "file_size": file_size,
        "analysis": analysis,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    db_manager.resumes.insert_one(resume_doc)
    
    # Update student profile to record that resume is uploaded
    db_manager.student_profiles.update_one(
        {"$or": [{"user_id": uid}, {"email": request.current_user["email"]}]},
        {"$set": {"has_resume": True, "resume_id": resume_id, "last_resume_analysis": analysis}}
    )
    
    return api_success({
        "resume_id": resume_id,
        "filename": filename,
        "analysis": analysis
    }, "Resume uploaded and analyzed successfully")

@resume_bp.route("/analysis", methods=["GET"])
@require_auth
def get_analysis():
    uid = request.current_user["uid"]
    # Find latest resume for user
    resumes = db_manager.resumes.find({"user_id": uid}, sort=[("created_at", -1)], limit=1)
    if not resumes:
        # Check profile
        profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": request.current_user["email"]}]})
        if profile and profile.get("last_resume_analysis"):
            return api_success(profile.get("last_resume_analysis"), "Resume analysis retrieved from profile")
        return api_error("No resume uploaded yet for this account.", "RESUME_NOT_FOUND", 404)
        
    return api_success(resumes[0].get("analysis"), "Resume analysis retrieved successfully")

@resume_bp.route("/save-skills", methods=["POST"])
@require_auth
def save_confirmed_skills():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    data = request.get_json(silent=True) or {}
    
    confirmed_skills = data.get("skills", [])
    if not isinstance(confirmed_skills, list):
        return api_error("Skills must be provided as a list.", "VALIDATION_ERROR", 400)
        
    # Merge with existing skills in student profile
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]})
    existing_skills = profile.get("skills", []) if profile else []
    
    merged_skills = list(dict.fromkeys(existing_skills + confirmed_skills))
    
    db_manager.student_profiles.update_one(
        {"$or": [{"user_id": uid}, {"email": email}]},
        {"$set": {
            "skills": merged_skills,
            "technical_skills": merged_skills,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }},
        upsert=True
    )
    
    return api_success({
        "skills": merged_skills,
        "count": len(merged_skills)
    }, "Confirmed skills saved to your student profile")
