# CareerBridge AI — REST API Documentation (v1)

CareerBridge AI provides a production-grade, RESTful API engineered with Python Flask, PyMongo (with resilient JSON store fallback), Firebase Authentication ID token verification, and modular AI/ML algorithmic services.

**Base URL:** `http://localhost:5000/api/v1` (or `/api` shorthand)  
**OpenAPI / Swagger Spec:** `http://localhost:5000/api/docs`  
**Health Check:** `http://localhost:5000/api/health`

---

## 1. Authentication & Security

All protected endpoints require an HTTP `Authorization` header containing a valid Bearer token:
```http
Authorization: Bearer <FIREBASE_ID_TOKEN_OR_DEMO_TOKEN>
```

### Response Standards

#### Standard Success Response (HTTP 200/201)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### Standard Error Response (HTTP 400/401/403/404/500)
```json
{
  "success": false,
  "message": "Invalid credentials or request parameter",
  "error_code": "AUTH_401"
}
```

---

## 2. API Endpoints Catalog

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/verify` | Public | Verify Firebase ID token and retrieve authenticated user profile session |
| `POST` | `/api/auth/demo-login` | Public | Instant 1-click evaluator login for `demo.student@careerbridge.ai` or `admin@careerbridge.ai` |
| `POST` | `/api/auth/logout` | Authenticated | Terminate session and invalidate client state |

### Student Profile Endpoints (`/api/student`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/student/profile` | Authenticated | Retrieve current authenticated student profile (skills, projects, education) |
| `PUT` | `/api/student/profile` | Authenticated | Update technical skills, degree, semester, projects, certifications, interests |
| `GET` | `/api/student/dashboard` | Authenticated | Aggregated live metrics: readiness score, recommendations, events, roadmap |

### Resume Analyzer Endpoints (`/api/resume`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/resume/upload` | Authenticated | Upload PDF resume, extract text via PyPDF2, and run NLP taxonomy skill identification |
| `GET` | `/api/resume/analysis` | Authenticated | Fetch latest parsed resume extraction report, strength metrics, and detected projects |

### Jobs & Internships Endpoints (`/api/opportunities`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/opportunities` | Public/Auth | Query verified opportunities with filters (`type`, `mode`, `experience`, `search`, `page`) |
| `GET` | `/api/opportunities/<id>` | Public/Auth | Retrieve single opportunity details with requirement breakdown |
| `POST` | `/api/opportunities/save` | Authenticated | Save / shortlist opportunity to student's saved list |
| `GET` | `/api/opportunities/saved` | Authenticated | Get all saved opportunities for authenticated student |
| `DELETE` | `/api/opportunities/saved/<id>` | Authenticated | Remove opportunity from student's saved list |

### Hackathons & Live Events Endpoints (`/api/events`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Public/Auth | Query upcoming hackathons, workshops, and placement drives with filtering |
| `GET` | `/api/events/<id>` | Public/Auth | Retrieve single event specifications, timeline, rules, and registration link |
| `GET` | `/api/events/upcoming` | Public/Auth | Fetch upcoming events ordered by registration deadline |
| `POST` | `/api/events/save` | Authenticated | Save event to student's personal calendar |
| `GET` | `/api/events/saved` | Authenticated | List all saved events for the authenticated student |
| `DELETE` | `/api/events/saved/<id>` | Authenticated | Remove event from saved calendar |

### AI Matching & Career Readiness Endpoints (`/api/ai`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/match` | Authenticated | Calculate weighted match score between student profile and target opportunity |
| `GET` | `/api/ai/recommendations`| Authenticated | Get personalized ranked opportunity recommendations with match explanations |
| `POST` | `/api/ai/skill-gap` | Authenticated | Detailed acquired vs missing skill breakdown with customizable proficiency levels |
| `POST` | `/api/ai/roadmap` | Authenticated | Generate dynamic 6-week Career GPS curriculum for target job role |
| `GET` | `/api/ai/readiness` | Authenticated | Compute 0-100 Career Readiness score with milestone what-if simulator |
| `POST` | `/api/ai/career-assistant`| Authenticated | Conversational career assistant grounded strictly in verified platform data |

#### Master Recommendation Weighted Formula
```
Match Score = (0.60 × Skill Match) + (0.20 × Education Eligibility) + (0.10 × Interest Match) + (0.10 × Location/Work Mode Match)
```

### Application Tracker Endpoints (`/api/applications`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/applications` | Authenticated | Fetch student's tracked applications across all status stages |
| `POST` | `/api/applications` | Authenticated | Create a new application tracker entry |
| `PUT` | `/api/applications/<id>` | Authenticated | Update application status (`Saved`, `Applied`, `Under Review`, `Interview`, `Selected`, `Rejected`, `Withdrawn`), notes, or interview dates |
| `DELETE` | `/api/applications/<id>`| Authenticated | Delete an application tracking card |

### Scholarships & Accessible Resources (`/api/resources`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resources` | Public/Auth | Directory of free verified certification courses, open-source projects |
| `GET` | `/api/scholarships`| Public/Auth | Directory of academic scholarships, research grants, and merit programs |

### Notifications Center (`/api/notifications`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Authenticated | Fetch personalized notifications for deadlines, opportunities, and roadmaps |
| `PUT` | `/api/notifications/<id>/read` | Authenticated | Mark notification as read |
| `PUT` | `/api/notifications/read-all` | Authenticated | Mark all notifications as read |

### Administrative Management Console (`/api/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin Only | Platform statistics, registration counts, active listings, and audit trails |
| `POST` | `/api/admin/opportunities` | Admin Only | Publish new verified job or internship listing |
| `PUT` | `/api/admin/opportunities/<id>`| Admin Only | Modify existing opportunity specifications or deadline |
| `DELETE` | `/api/admin/opportunities/<id>`| Admin Only | Remove expired or invalid opportunity |
| `POST` | `/api/admin/events` | Admin Only | Broadcast new hackathon, workshop, or hiring drive |
| `PUT` | `/api/admin/events/<id>` | Admin Only | Update event timeline or registration link |
| `DELETE` | `/api/admin/events/<id>` | Admin Only | Delist event |
| `GET` | `/api/admin/reports` | Admin Only | Community reports regarding broken links or outdated information |
