import os
from flask import Flask, jsonify
from flask_cors import CORS
from config.settings import config
from utils.response import api_error

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["MAX_CONTENT_LENGTH"] = config.MAX_CONTENT_LENGTH
    
    # Configure CORS with allowed origins
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"]
        }
    })
    
    # Register Route Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.student_routes import student_bp
    from app.routes.resume_routes import resume_bp
    from app.routes.opportunity_routes import opps_bp
    from app.routes.event_routes import events_bp
    from app.routes.ai_routes import ai_bp
    from app.routes.application_routes import app_bp
    from app.routes.resource_routes import resource_bp
    from app.routes.notification_routes import notif_bp
    from app.routes.admin_routes import admin_bp
    
    # Register under /api/v1/* (primary versioned)
    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth", name="auth_v1")
    app.register_blueprint(student_bp, url_prefix="/api/v1/student", name="student_v1")
    app.register_blueprint(resume_bp, url_prefix="/api/v1/resume", name="resume_v1")
    app.register_blueprint(opps_bp, url_prefix="/api/v1/opportunities", name="opps_v1")
    app.register_blueprint(events_bp, url_prefix="/api/v1/events", name="events_v1")
    app.register_blueprint(ai_bp, url_prefix="/api/v1/ai", name="ai_v1")
    app.register_blueprint(app_bp, url_prefix="/api/v1/applications", name="app_v1")
    app.register_blueprint(resource_bp, url_prefix="/api/v1", name="resource_v1")
    app.register_blueprint(notif_bp, url_prefix="/api/v1/notifications", name="notif_v1")
    app.register_blueprint(admin_bp, url_prefix="/api/v1/admin", name="admin_v1")
    
    # Also register under /api/* (shorthand for prompt compatibility)
    app.register_blueprint(auth_bp, url_prefix="/api/auth", name="auth_shorthand")
    app.register_blueprint(student_bp, url_prefix="/api/student", name="student_shorthand")
    app.register_blueprint(resume_bp, url_prefix="/api/resume", name="resume_shorthand")
    app.register_blueprint(opps_bp, url_prefix="/api/opportunities", name="opps_shorthand")
    app.register_blueprint(events_bp, url_prefix="/api/events", name="events_shorthand")
    app.register_blueprint(ai_bp, url_prefix="/api/ai", name="ai_shorthand")
    app.register_blueprint(app_bp, url_prefix="/api/applications", name="app_shorthand")
    app.register_blueprint(resource_bp, url_prefix="/api", name="resource_shorthand")
    app.register_blueprint(notif_bp, url_prefix="/api/notifications", name="notif_shorthand")
    app.register_blueprint(admin_bp, url_prefix="/api/admin", name="admin_shorthand")
        
    # Health and Documentation Route
    @app.route("/api/health", methods=["GET"])
    @app.route("/api/v1/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "CareerBridge AI API Engine",
            "version": "1.0.0",
            "tagline": "Your Skills. Your Future. Our AI."
        })
        
    @app.route("/api/docs", methods=["GET"])
    @app.route("/api/v1/docs", methods=["GET"])
    def api_docs():
        return jsonify({
            "title": "CareerBridge AI REST API Specification",
            "version": "1.0.0",
            "base_url": "/api/v1",
            "tagline": "Your Skills. Your Future. Our AI.",
            "endpoints": {
                "Auth": ["POST /api/v1/auth/register", "POST /api/v1/auth/login", "POST /api/v1/auth/verify", "POST /api/v1/auth/forgot-password", "POST /api/v1/auth/logout", "GET /api/v1/auth/me"],
                "Student": ["GET /api/v1/student/profile", "PUT /api/v1/student/profile", "GET /api/v1/student/dashboard"],
                "Resume": ["POST /api/v1/resume/upload", "GET /api/v1/resume/analysis", "POST /api/v1/resume/save-skills"],
                "Opportunities": ["GET /api/v1/opportunities", "GET /api/v1/opportunities/:id", "POST /api/v1/opportunities/save", "GET /api/v1/opportunities/saved", "DELETE /api/v1/opportunities/saved/:id"],
                "Events": ["GET /api/v1/events", "GET /api/v1/events/:id", "POST /api/v1/events/save", "GET /api/v1/events/saved", "GET /api/v1/events/upcoming"],
                "AI": ["POST /api/v1/ai/match", "GET /api/v1/ai/recommendations", "POST /api/v1/ai/skill-gap", "POST /api/v1/ai/roadmap", "GET /api/v1/ai/readiness", "POST /api/v1/ai/simulate-readiness", "POST /api/v1/ai/career-assistant"],
                "Applications": ["GET /api/v1/applications", "POST /api/v1/applications", "PUT /api/v1/applications/:id", "DELETE /api/v1/applications/:id"],
                "Resources": ["GET /api/v1/resources", "GET /api/v1/scholarships", "GET /api/v1/equalizer"],
                "Notifications": ["GET /api/v1/notifications", "PUT /api/v1/notifications/:id/read", "PUT /api/v1/notifications/read-all"],
                "Admin": ["GET /api/v1/admin/dashboard", "POST /api/v1/admin/opportunities", "PUT /api/v1/admin/opportunities/:id", "DELETE /api/v1/admin/opportunities/:id", "POST /api/v1/admin/events", "GET /api/v1/admin/reports"]
            }
        })

    # Error Handlers
    @app.errorhandler(400)
    def handle_bad_request(e):
        return api_error("Bad request", "HTTP_400", 400)

    @app.errorhandler(404)
    def handle_not_found(e):
        return api_error("The requested resource was not found", "HTTP_404", 404)

    @app.errorhandler(413)
    def handle_large_file(e):
        return api_error("File size exceeds 16MB limit", "HTTP_413_FILE_TOO_LARGE", 413)

    @app.errorhandler(500)
    def handle_server_error(e):
        return api_error("Internal server error. Please try again later.", "HTTP_500", 500)

    return app
