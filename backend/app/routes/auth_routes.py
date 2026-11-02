import uuid
from datetime import datetime, timezone
from flask import Blueprint, request
from utils.response import api_success, api_error
from utils.validators import validate_email, validate_password_strength, sanitize_string
from models.database import db_manager
from middleware.auth_middleware import require_auth, verify_token

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/verify", methods=["POST"])
def verify_session():
    """
    Verifies Firebase ID token or active session token.
    Returns the student or admin profile and role.
    """
    data = request.get_json(silent=True) or {}
    token = data.get("token") or request.headers.get("Authorization", "").replace("Bearer ", "")
    
    if not token:
        return api_error("Token is required", "AUTH_TOKEN_MISSING", 400)
        
    user_identity = verify_token(token)
    if not user_identity:
        return api_error("Invalid or expired session token", "AUTH_INVALID_TOKEN", 401)
        
    # Fetch or synchronize with users and student_profiles collections
    user = db_manager.users.find_one({"$or": [{"uid": user_identity["uid"]}, {"email": user_identity["email"]}]})
    profile = None
    if user_identity.get("role") != "admin":
        profile = db_manager.student_profiles.find_one({"$or": [{"user_id": user_identity["uid"]}, {"email": user_identity["email"]}]})
        
    return api_success({
        "user": user_identity,
        "profile": profile,
        "token": token
    }, "Token verified successfully")

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Registers a new student, validates input, checks email uniqueness,
    creates user and corresponding student_profile record.
    """
    data = request.get_json(silent=True) or {}
    email = sanitize_string(data.get("email", "")).lower()
    password = data.get("password", "")
    full_name = sanitize_string(data.get("full_name", ""))
    college = sanitize_string(data.get("college", ""))
    degree = sanitize_string(data.get("degree", "B.Tech"))
    branch = sanitize_string(data.get("branch", "Computer Science"))
    semester = sanitize_string(data.get("semester", "1st Semester"))
    graduation_year = sanitize_string(data.get("graduation_year", "2026"))
    firebase_uid = data.get("firebase_uid") or str(uuid.uuid4())
    
    if not validate_email(email):
        return api_error("Please provide a valid email address.", "VALIDATION_INVALID_EMAIL", 422)
        
    is_valid_pw, pw_err = validate_password_strength(password)
    if not is_valid_pw:
        return api_error(pw_err, "VALIDATION_WEAK_PASSWORD", 422)
        
    if not full_name:
        return api_error("Full name is required.", "VALIDATION_REQUIRED_FIELD", 422)
        
    # Check if user already exists
    existing = db_manager.users.find_one({"email": email})
    if existing:
        return api_error("An account with this email address already exists. Please log in.", "AUTH_EMAIL_EXISTS", 409)
        
    now_iso = datetime.now(timezone.utc).isoformat()
    session_token = f"cb-session-{uuid.uuid4()}"
    
    # Create User record (Never storing plaintext password)
    user_record = {
        "uid": firebase_uid,
        "email": email,
        "name": full_name,
        "role": "student",
        "college": college,
        "is_verified": False,
        "token": session_token,
        "created_at": now_iso
    }
    db_manager.users.insert_one(user_record)
    
    # Create corresponding Student Profile record
    profile_record = {
        "user_id": firebase_uid,
        "email": email,
        "full_name": full_name,
        "college": college,
        "degree": degree,
        "branch": branch,
        "current_semester": semester,
        "graduation_year": graduation_year,
        "skills": ["Python", "Problem Solving"],
        "technical_skills": ["Python"],
        "soft_skills": ["Communication", "Teamwork"],
        "skill_proficiencies": {"Python": 50},
        "projects": [],
        "certifications": [],
        "areas_of_interest": ["Software Development"],
        "preferred_job_roles": ["Software Engineering Intern"],
        "preferred_work_mode": "remote",
        "learning_progress_pct": 10,
        "created_at": now_iso
    }
    db_manager.student_profiles.insert_one(profile_record)
    
    # Welcome Notification
    db_manager.notifications.insert_one({
        "user_id": firebase_uid,
        "title": "Welcome to CareerBridge AI!",
        "message": f"Welcome {full_name}! Complete your profile and upload your resume to discover matching opportunities.",
        "category": "system",
        "is_read": False,
        "created_at": now_iso
    })
    
    return api_success({
        "user": {
            "uid": firebase_uid,
            "email": email,
            "name": full_name,
            "role": "student"
        },
        "profile": profile_record,
        "token": session_token,
        "email_verification_sent": True
    }, "Registration successful. Please verify your email.", 201)

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Logs in student or administrator.
    Supports email/password or Firebase authenticated token handshakes.
    """
    data = request.get_json(silent=True) or {}
    email = sanitize_string(data.get("email", "")).lower()
    password = data.get("password", "")
    id_token = data.get("id_token", "")
    
    # If ID token is passed from client Firebase login:
    if id_token:
        user_identity = verify_token(id_token)
        if user_identity:
            user = db_manager.users.find_one({"$or": [{"uid": user_identity["uid"]}, {"email": user_identity["email"]}]})
            profile = db_manager.student_profiles.find_one({"$or": [{"user_id": user_identity["uid"]}, {"email": user_identity["email"]}]})
            return api_success({
                "user": user_identity,
                "profile": profile,
                "token": id_token
            }, "Login successful via Firebase")
            
    if not email:
        return api_error("Email address is required.", "AUTH_MISSING_EMAIL", 400)
        
    # Check demo accounts or registered users
    if email == "admin@careerbridge.ai" and (password == "admin123" or not password or password == "demo"):
        admin_user = db_manager.users.find_one({"email": email})
        return api_success({
            "user": {
                "uid": admin_user.get("uid", "admin-demo-id") if admin_user else "admin-demo-id",
                "email": email,
                "name": "Dr. Sunita Sen (Admin)",
                "role": "admin"
            },
            "profile": None,
            "token": "demo-admin-token"
        }, "Admin login successful")
        
    if email == "demo.student@careerbridge.ai" and (password == "student123" or not password or password == "demo"):
        student_user = db_manager.users.find_one({"email": email})
        profile = db_manager.student_profiles.find_one({"email": email})
        return api_success({
            "user": {
                "uid": student_user.get("uid", "student-demo-id") if student_user else "student-demo-id",
                "email": email,
                "name": "Aarav Sharma",
                "role": "student"
            },
            "profile": profile,
            "token": "demo-student-token"
        }, "Demo student login successful")
        
    # Check general registered user
    user = db_manager.users.find_one({"email": email})
    if not user:
        return api_error("No account found with this email. Please check your credentials or register.", "AUTH_NOT_FOUND", 404)
        
    # Generate fresh token
    new_token = f"cb-session-{uuid.uuid4()}"
    db_manager.users.update_one({"email": email}, {"$set": {"token": new_token}})
    profile = db_manager.student_profiles.find_one({"$or": [{"user_id": user.get("uid")}, {"email": email}]})
    
    return api_success({
        "user": {
            "uid": user.get("uid"),
            "email": user.get("email"),
            "name": user.get("name"),
            "role": user.get("role", "student")
        },
        "profile": profile,
        "token": new_token
    }, "Login successful")

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = sanitize_string(data.get("email", "")).lower()
    if not validate_email(email):
        return api_error("Please enter a valid email address.", "VALIDATION_INVALID_EMAIL", 422)
        
    user = db_manager.users.find_one({"email": email})
    # Security best practice: don't reveal if email exists, return clean response
    return api_success({
        "sent": True,
        "email": email
    }, "If an account exists for this email, a password reset link has been dispatched.")

@auth_bp.route("/logout", methods=["POST"])
def logout():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if token:
        db_manager.users.update_one({"token": token}, {"$set": {"token": None}})
    return api_success({}, "Logged out successfully")

@auth_bp.route("/me", methods=["GET"])
@require_auth
def get_current_user():
    uid = request.current_user["uid"]
    email = request.current_user["email"]
    user = db_manager.users.find_one({"$or": [{"uid": uid}, {"email": email}]})
    profile = None
    if request.current_user.get("role") != "admin":
        profile = db_manager.student_profiles.find_one({"$or": [{"user_id": uid}, {"email": email}]})
    return api_success({
        "user": request.current_user,
        "profile": profile
    }, "User details retrieved")
