# CareerBridge AI 🚀
> **Tagline:** *"Your Skills. Your Future. Our AI."*  
> **Mission:** *"We don't just help students find jobs. We help students become ready for jobs."*

---

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask%20REST-green.svg)](https://flask.palletsprojects.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61dafb.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styles-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248.svg)](https://www.mongodb.com/)
[![Firebase Auth](https://img.shields.io/badge/Auth-Firebase%20ID%20Token-FFCA28.svg)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Executive Summary

**CareerBridge AI** is an AI-powered campus-to-employment opportunity platform engineered specifically for college students and recent graduates. Unlike traditional job portals that merely display static vacancy listings, CareerBridge AI assesses student competencies, quantifies their readiness score, identifies explicit skill deficits, and generates structured 6-week learning roadmaps to transform candidates into hireable professionals.

Built as a modern, full-stack, responsive web application ready for national-level hackathons and enterprise career centers, CareerBridge AI combines weighted recommendation algorithms, PDF resume NLP parsing, live event aggregation, and an Opportunity Equalizer that democratizes career opportunities regardless of background or pedigree.

---

## ⚡ Quick Start for Evaluators & Judges (2-Minute Launch)

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### 2. Backend Setup
```bash
# Clone and enter the repository
cd "Tech Tonic"

# Setup and run backend
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Seed realistic demo data (30 skills, 20 opportunities, 15 hackathons, 10 profiles)
python seed_data.py

# Start Flask API server (Listening on port 5000)
python run.py
```

### 3. Frontend Setup
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Evaluator One-Click Demo Credentials

To make evaluation seamless during presentations, the platform includes instant one-click login buttons on the login screen, or you may enter the verified demo credentials manually:

| Account Type | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Verified Student** | `demo.student@careerbridge.ai` | `Student@1234` | Complete Dashboard, AI Matching (82% Python match), Skill Gap Radar, Career GPS Roadmap, Resume Upload |
| **Administrator** | `admin@careerbridge.ai` | `Admin@1234` | Superadmin Management Console, Opportunity CRUD, Hackathon Broadcast, Community Moderation Reports |

---

## 🧠 Core System Modules & Innovations

### 1. AI Opportunity Matching Engine
Implements the exact multi-factor weighted scoring formula:
$$\text{Match Score} = (0.60 \times \text{Skill}) + (0.20 \times \text{Education}) + (0.10 \times \text{Interest}) + (0.10 \times \text{Location/WorkMode})$$
- Generates transparent, human-readable explanations:
  - *Strong Matches:* Displays acquired competencies that aligned with the role.
  - *Missing Skills:* Highlights actionable deficits.
  - *Education Eligibility:* Validates degree and semester prerequisites without bias.
  - *Ethical AI Guarantee:* Protected characteristics (caste, religion, gender, disability, financial status) are strictly excluded from recommendation weights.

### 2. Skill Gap Analyzer
- Side-by-side comparison of current acquired skills versus role requirements.
- Visual bar charts with interactive proficiency sliders (0% to 100%).
- One-click launcher for targeted learning roadmaps.

### 3. Career GPS (Personalized Learning Roadmap)
- Tailors a weekly step-by-step curriculum targeting the student's chosen job role.
- Curates verified free educational resources (freeCodeCamp, Harvard CS50, Coursera financial aid, MDN Web Docs).
- Interactive milestone checkboxes with automatic progress persistence.

### 4. Opportunity Equalizer (Unique Innovation)
- Specifically filters and surfaces **beginner-friendly**, **no prior experience required**, **remote**, and **scholarship/stipend-backed** opportunities.
- Levels the playing field for students from non-tier-1 colleges and underserved communities.

### 5. Career Readiness Simulator
- Calculates an illustrative 0–100 Readiness Score based on technical skills, projects, certifications, and resume completeness.
- **Interactive "What-If" Simulator:** Enables students to preview how acquiring 2 missing skills and completing a recommended capstone project instantly elevates their readiness score from 65 to 88.

### 6. NLP Resume Analyzer
- Supports PDF resume uploads with size and file type validation.
- Extracts raw text using PyPDF2 and performs regex and taxonomy tokenization against 30+ technical skills.
- Allows students to review, edit, and confirm extracted skills before saving them to their active profile.

### 7. Hackathons & Tech Events Hub
- Direct aggregation of upcoming college hackathons, coding contests, workshops, placement drives, and tech conferences.
- Multi-dimensional filters (Category, Online/Offline, Location, Free/Paid, Upcoming Deadline).
- Personal "My Saved Events" calendar and registration tracking.

### 8. Grounded AI Career Assistant
- Chatbot grounded strictly in the authenticated student's profile and verified database records.
- Refuses to invent fake vacancies, fraudulent deadlines, or unverified links.
- Supports optional live Google Gemini API connectivity with instant deterministic fallback.

### 9. Application Tracking System (ATS Kanban)
- Full lifecycle status management: `Saved` → `Applied` → `Under Review` → `Interview` → `Selected` → `Rejected` → `Withdrawn`.
- Personal notes, interview date reminders, and application deadline alerts.

### 10. Admin Management Console
- Restricted to verified administrator accounts.
- Create, modify, and delete opportunities and hackathon listings in real-time.
- Community report moderation table to inspect user-flagged listings or broken links.

---

## 🏗️ Architectural Topology

```
c:\Users\pooja\Documents\Tech Tonic\
├── backend/
│   ├── app/
│   │   ├── routes/              # Auth, Student, Opportunities, Events, AI, Resume, Admin, Apps
│   │   ├── services/            # Matching engine, Skill gap, Career GPS, Resume NLP, Readiness
│   │   └── middleware/          # Firebase ID token validation & Admin authorization
│   ├── models/
│   │   └── database.py          # Dual MongoDB Atlas + zero-config persistent JSON fallback store
│   ├── config/
│   │   └── settings.py          # Environment, CORS whitelist, upload rules
│   ├── seed_data.py             # Verified demo dataset seeder
│   ├── requirements.txt         # Python dependencies
│   └── run.py                   # Flask server entrypoint (port 5000)
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Sidebar, TopHeader, Navbar, ProtectedRoute
│   │   ├── context/             # AuthContext (Firebase, session persistence, demo switcher)
│   │   ├── layouts/             # DashboardLayout (responsive sidebar & topbar)
│   │   ├── pages/               # 21 modular pages (Dashboard, Matching, Gap, GPS, Admin, etc.)
│   │   ├── services/            # Axios API client with automatic token attachment
│   │   ├── index.css            # Tailwind CSS design system tokens
│   │   ├── App.jsx              # React Router route registry
│   │   └── main.jsx             # React DOM root
│   ├── vite.config.js           # Vite config with /api reverse proxy to port 5000
│   └── package.json             # React, Vite, Tailwind v4, Recharts, Lucide
│
├── docs/
│   ├── API_DOCUMENTATION.md     # Full REST API specification & Swagger schemas
│   └── SETUP_GUIDE.md           # Step-by-step local & cloud deployment guide
│
├── .env.example                 # Sanitized environment variable template
└── README.md                    # Project documentation
```

---

## 🔒 Security & Data Integrity

1. **Authentication Verification:** The backend never trusts client-supplied user IDs. All protected endpoints verify the authenticated cryptographic identity through Firebase ID tokens or verified session signatures.
2. **CORS Restrictions:** Allowed origins are strictly locked to `http://localhost:5173` and trusted origins in production.
3. **Data Ownership:** Students can only read and mutate their own resumes, profile records, applications, and saved bookmarks.
4. **Resilient Local Data Store:** If MongoDB Atlas credentials are not provided in development, the backend automatically utilizes `backend/data/db_store.json`, providing identical PyMongo query syntax without crashing.
5. **Ethical AI Safeguards:** Recommendation algorithms are deterministic and transparent. No black-box rejections or discriminatory demographic profiling.

---

## 🧪 Comprehensive Testing Scenarios

| Test Case | Steps to Execute | Expected Behavior |
| :--- | :--- | :--- |
| **1. 1-Click Student Login** | Click "Demo Student Login" on `/login` | Authenticates instantly; redirects to `/dashboard` with student stats. |
| **2. AI Matching Engine** | Navigate to "AI Opportunity Matching" | Displays opportunities ranked by match score with transparent reasons. |
| **3. Resume Parsing** | Navigate to "Resume Analyzer", upload a PDF | PyPDF2 extracts text, NLP identifies skills, allows manual edits & saving. |
| **4. Skill Gap & Roadmap** | Click "View Skill Gap" -> "Generate Roadmap" | Renders Recharts bar chart of missing skills and 6-week Career GPS plan. |
| **5. Application Tracking** | Go to "Jobs & Internships" -> click "Save" & "Apply" | Tracked under "My Applications" with status progression. |
| **6. Admin Console** | Switch to Admin role -> Visit `/admin` | Displays platform stats, opportunity & event CRUD forms, moderation list. |
| **7. Protected Route Guard** | Log out and attempt visiting `/dashboard` | Automatically redirects to `/login` with session expiration alert. |

---

## 📜 Disclaimer & Ethical Use

All sample company listings, vacancies, stipends, and applicant profiles bundled in this repository are **DEMO DATA** created solely for academic evaluation and hackathon demonstrations. CareerBridge AI is architected to interface with authorized university career portals, official employer APIs, and verified public event feeds.

---

## 👥 Authors & Acknowledgments

Developed with ❤️ for **CareerBridge AI** — empowering the next generation of engineers, developers, and creators to achieve career excellence through intelligent, transparent technology.
