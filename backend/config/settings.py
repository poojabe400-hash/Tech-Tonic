import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "careerbridge-ai-super-secret-key-2026")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1")
    
    # MongoDB Atlas Connection
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://demo:demo@cluster0.mongodb.net/?retryWrites=true&w=majority")
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "careerbridge_ai")
    
    # Firebase
    FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "config/firebase_credentials.json")
    FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "careerbridge-ai")
    
    # Optional LLM
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    
    # CORS
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000").split(",")
    
    # File upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024 # 16 MB
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    ALLOWED_EXTENSIONS = {"pdf"}

config = Config()
