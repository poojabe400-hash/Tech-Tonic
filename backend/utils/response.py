from flask import jsonify

def api_success(data=None, message="Operation successful", status_code=200):
    response = {
        "success": True,
        "message": message,
        "data": data if data is not None else {}
    }
    return jsonify(response), status_code

def api_error(message="An error occurred", error_code="INTERNAL_ERROR", status_code=400, details=None):
    response = {
        "success": False,
        "message": message,
        "error_code": error_code
    }
    if details:
        response["details"] = details
    return jsonify(response), status_code
