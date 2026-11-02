# CareerBridge AI — Setup & Deployment Guide

This guide covers everything required to install, configure, develop, and deploy **CareerBridge AI** locally or to cloud environments.

---

## 1. Prerequisites

Before setting up the project, ensure you have the following installed:
- **Python**: 3.10+ (tested on Python 3.10, 3.11, 3.12, 3.13)
- **Node.js**: 18+ or 20+ (with npm)
- **Git**

*(Optional for cloud features)*:
- **MongoDB Atlas** account (or local MongoDB). If MongoDB is omitted, CareerBridge AI automatically utilizes its resilient JSON-backed data store (`backend/data/db_store.json`), which supports full CRUD without requiring database installation.
- **Firebase Project** for production email verification (demo evaluator bypass is active out of the box).
- **Google Gemini API Key** for optional live career assistant reasoning (fallback rule-based grounded engine is active out of the box).

---

## 2. Quick Local Setup (Under 2 Minutes)

### Step 2.1: Clone the Repository
```bash
git clone <repository-url>
cd "Tech Tonic"
```

### Step 2.2: Backend Configuration & Startup
```bash
# Navigate to backend
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template (or leave default for zero-config mode)
cp ../.env.example .env

# Seed initial verified demo data (30 skills, 20 opportunities, 15 hackathons, 10 profiles)
python seed_data.py

# Launch Flask REST API server (runs on port 5000)
python run.py
```

### Step 2.3: Frontend Setup & Startup
In a separate terminal window:
```bash
# Navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start Vite React development server (runs on port 5173 with automatic backend proxy)
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 3. Evaluator Hackathon Credentials (Instant Access)

The platform includes 1-click evaluator login buttons on the login screen, or you can use these verified demo accounts:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Student** | `demo.student@careerbridge.ai` | `Student@1234` | Full access to Dashboard, AI Matching, Resume Analyzer, GPS, Equalizer |
| **Administrator** | `admin@careerbridge.ai` | `Admin@1234` | Access to Management Console, Opportunity & Event CRUD, Moderation |

---

## 4. Environment Variables Reference

Create a `.env` file in the root or `backend/` directory:

```ini
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=careerbridge_super_secret_jwt_key_2026

# Database Configuration (Leave empty to use resilient zero-config JSON store)
MONGODB_URI=
DATABASE_NAME=careerbridge_db

# Firebase Authentication (Optional in development)
FIREBASE_PROJECT_ID=careerbridge-ai
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# AI & LLM Assistance (Optional - platform works independently)
GEMINI_API_KEY=

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 5. Verification Checklist

1. **Backend Health Check:** Visit `http://localhost:5000/api/health` — Expect `{"status": "healthy"}`.
2. **API Documentation:** Visit `http://localhost:5000/api/docs` — Expect Swagger documentation UI.
3. **Frontend Landing:** Visit `http://localhost:5173` — Check responsive hero, live counters, opportunity cards.
4. **Student Flow:** Log in via 1-Click Demo -> Upload PDF resume -> Inspect extracted skills -> Launch Skill Gap Analyzer -> View Career GPS 6-week roadmap.
5. **Admin Flow:** Click Top Bar "Switch Role" -> Enter Admin console -> Add a new Hackathon or Opportunity -> Observe immediate platform synchronization.

---

## 6. Production Deployment Instructions

### Deploying Backend (Render / Railway / AWS EC2 / Google Cloud Run)
1. Build Python container or configure build command:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Set start command:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 run:app
   ```
3. Set environment variables (`FLASK_ENV=production`, `MONGODB_URI`, `SECRET_KEY`, `ALLOWED_ORIGINS`).

### Deploying Frontend (Vercel / Netlify / Firebase Hosting)
1. Build production static bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Configure publish directory: `frontend/dist`
3. Configure API reverse proxy or set `VITE_API_URL` to point to the production backend URL.
