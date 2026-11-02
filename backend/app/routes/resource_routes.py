from flask import Blueprint, request
from utils.response import api_success
from models.database import db_manager

resource_bp = Blueprint("resource_bp", __name__)

@resource_bp.route("/resources", methods=["GET"])
def list_resources():
    category = request.args.get("category")
    free_only = request.args.get("free_only", "").lower() in ("true", "1")
    
    query = {}
    if category and category != "all":
        query["category"] = category
    if free_only:
        query["is_free"] = True
        
    resources = list(db_manager.learning_resources.find(query))
    return api_success(resources, "Learning resources fetched successfully")

@resource_bp.route("/scholarships", methods=["GET"])
def list_scholarships():
    category = request.args.get("category")
    query = {}
    if category and category != "all":
        query["category"] = category
    scholarships = list(db_manager.scholarships.find(query))
    return api_success(scholarships, "Scholarships and grants fetched successfully")

@resource_bp.route("/equalizer", methods=["GET"])
def get_opportunity_equalizer_feed():
    """
    Dedicated endpoint for the Opportunity Equalizer innovation.
    Curates and filters opportunities that are accessible, free, beginner-friendly, remote,
    or provide financial assistance/mentorship.
    """
    category = request.args.get("category", "all")
    
    # Fetch accessible opportunities
    opps = list(db_manager.opportunities.find({
        "$or": [
            {"is_beginner_friendly": True},
            {"mode": "remote"},
            {"category": "Open Source"}
        ]
    }))
    
    # Fetch free resources
    resources = list(db_manager.learning_resources.find({"is_free": True}))
    
    # Fetch scholarships
    scholarships = list(db_manager.scholarships.find({}))
    
    return api_success({
        "accessible_opportunities": opps,
        "free_certifications_and_courses": resources,
        "scholarships": scholarships,
        "total_equalizer_items": len(opps) + len(resources) + len(scholarships),
        "philosophy": "Democratizing career access: Every student deserves high-quality opportunities regardless of college tier, geography, or socioeconomic background."
    }, "Opportunity Equalizer curated feed retrieved successfully")
