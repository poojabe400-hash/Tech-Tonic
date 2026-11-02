import re

def validate_email(email):
    if not email or not isinstance(email, str):
        return False
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return bool(re.match(pattern, email.strip()))

def validate_password_strength(password):
    if not password or len(password) < 6:
        return False, "Password must be at least 6 characters long."
    return True, ""

def sanitize_string(text, max_length=500):
    if not text:
        return ""
    text = str(text).strip()
    return text[:max_length]
