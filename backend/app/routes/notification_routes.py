from datetime import datetime, timezone
from flask import Blueprint, request
from utils.response import api_success, api_error
from models.database import db_manager
from middleware.auth_middleware import require_auth

notif_bp = Blueprint("notif_bp", __name__)

@notif_bp.route("", methods=["GET"])
@require_auth
def list_notifications():
    uid = request.current_user["uid"]
    notifications = list(db_manager.notifications.find({"user_id": uid}, sort=[("created_at", -1)]))
    unread_count = sum(1 for n in notifications if not n.get("is_read"))
    return api_success({
        "items": notifications,
        "unread_count": unread_count
    }, "Notifications retrieved successfully")

@notif_bp.route("/<notif_id>/read", methods=["PUT"])
@require_auth
def mark_read(notif_id):
    uid = request.current_user["uid"]
    db_manager.notifications.update_one(
        {"_id": notif_id, "user_id": uid},
        {"$set": {"is_read": True, "read_at": datetime.now(timezone.utc).isoformat()}}
    )
    return api_success({}, "Notification marked as read")

@notif_bp.route("/read-all", methods=["PUT"])
@require_auth
def mark_all_read():
    uid = request.current_user["uid"]
    all_notifs = list(db_manager.notifications.find({"user_id": uid}))
    for n in all_notifs:
        db_manager.notifications.update_one(
            {"_id": n["_id"]},
            {"$set": {"is_read": True, "read_at": datetime.now(timezone.utc).isoformat()}}
        )
    return api_success({}, "All notifications marked as read")
