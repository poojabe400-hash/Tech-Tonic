import os
import re
from PyPDF2 import PdfReader

# Comprehensive taxonomy of technical skills, languages, tools & frameworks
TECH_TAXONOMY = {
    "Programming Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Rust", "Kotlin", "Swift", "PHP", "Ruby", "R", "Dart", "SQL"
    ],
    "Frontend & UI": [
        "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "HTML", "HTML5", "CSS", "CSS3", "Tailwind CSS", "Bootstrap", "Redux", "Sass", "Webpack", "Vite"
    ],
    "Backend & APIs": [
        "Node.js", "Express", "Flask", "Django", "FastAPI", "Spring Boot", "ASP.NET", "REST", "REST API", "GraphQL", "gRPC", "Microservices"
    ],
    "Databases & Cloud": [
        "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Firebase", "AWS", "Google Cloud", "GCP", "Azure", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD"
    ],
    "AI, ML & Data": [
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "OpenCV", "Data Analysis", "Tableau", "Power BI"
    ]
}

FLAT_SKILLS = []
for category, skills in TECH_TAXONOMY.items():
    for s in skills:
        FLAT_SKILLS.append((s, category))

def extract_text_from_pdf(pdf_path):
    """Safely extracts raw text from PDF file."""
    if not os.path.exists(pdf_path):
        return ""
    text_parts = []
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
    except Exception as e:
        print(f"[Resume Analyzer] Error reading PDF: {e}")
    return "\n".join(text_parts)

def parse_resume_content(raw_text):
    """
    Extracts skills, contacts, education hints, and project keywords from resume text.
    """
    if not raw_text:
        return {
            "skills": [],
            "skills_by_category": {},
            "email": "",
            "phone": "",
            "projects": [],
            "education": [],
            "strengths": [],
            "improvements": ["Upload a resume with selectable text for automated extraction."]
        }
        
    text_lower = raw_text.lower()
    
    # 1. Skill Extraction
    extracted_skills = []
    skills_by_category = {}
    
    for skill_name, category in FLAT_SKILLS:
        # Regex word boundary check for short terms like C, R, Go to prevent false positives
        if len(skill_name) <= 2:
            pattern = r'\b' + re.escape(skill_name.lower()) + r'\b'
        else:
            pattern = r'(?<![a-zA-Z0-9])' + re.escape(skill_name.lower()) + r'(?![a-zA-Z0-9])'
            
        if re.search(pattern, text_lower):
            extracted_skills.append(skill_name)
            skills_by_category.setdefault(category, []).append(skill_name)
            
    # Deduplicate while preserving order
    extracted_skills = list(dict.fromkeys(extracted_skills))
    
    # 2. Contact details
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
    email = email_match.group(0) if email_match else ""
    
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
    phone = phone_match.group(0) if phone_match else ""
    
    # 3. Detect Project Mentions
    projects = []
    lines = raw_text.splitlines()
    in_project_section = False
    for line in lines:
        stripped = line.strip()
        if re.search(r'\b(projects|academic projects|key projects)\b', stripped.lower()):
            in_project_section = True
            continue
        if in_project_section:
            if re.search(r'\b(experience|education|skills|certifications|achievements)\b', stripped.lower()) and len(stripped) < 25:
                in_project_section = False
                break
            if len(stripped) > 5 and not stripped.startswith("-"):
                # Potential project title
                if len(projects) < 4:
                    projects.append(stripped[:70])
                    
    # Fallback default projects if section not structured
    if not projects:
        if "react" in text_lower or "web" in text_lower:
            projects.append("Full Stack Web Application")
        if "machine learning" in text_lower or "prediction" in text_lower:
            projects.append("Predictive Machine Learning Pipeline")
            
    # 4. Education detection
    education = []
    if "b.tech" in text_lower or "bachelor of technology" in text_lower:
        education.append("Bachelor of Technology (B.Tech)")
    elif "b.e" in text_lower or "bachelor of engineering" in text_lower:
        education.append("Bachelor of Engineering (B.E.)")
    elif "bca" in text_lower or "mca" in text_lower:
        education.append("Computer Applications (BCA / MCA)")
    elif "b.sc" in text_lower:
        education.append("Bachelor of Science (B.Sc)")
        
    # 5. Technical Strengths
    strengths = []
    if len(skills_by_category.get("Programming Languages", [])) >= 2:
        strengths.append(f"Strong language diversity: {', '.join(skills_by_category['Programming Languages'][:3])}")
    if skills_by_category.get("Databases & Cloud"):
        strengths.append(f"Infrastructure and database familiarity: {', '.join(skills_by_category['Databases & Cloud'][:2])}")
    if len(extracted_skills) >= 6:
        strengths.append(f"Solid technical breadth with {len(extracted_skills)} recognized competencies")
        
    # 6. Actionable Resume Improvement Suggestions
    improvements = []
    if not any(cat == "Databases & Cloud" for cat in skills_by_category):
        improvements.append("Add cloud or containerization tools (Docker, AWS, or Git) to strengthen devops readiness.")
    if len(projects) < 2:
        improvements.append("Include at least 2 detailed project entries with metrics, GitHub links, and tech stack details.")
    if "github.com" not in text_lower:
        improvements.append("Add a direct link to your active GitHub profile so recruiters can review your code.")
    if not improvements:
        improvements.append("Your resume exhibits clear structure and strong technical keywords.")
        
    return {
        "extracted_skills": extracted_skills,
        "skills_by_category": skills_by_category,
        "detected_email": email,
        "detected_phone": phone,
        "detected_projects": projects,
        "detected_education": education,
        "technical_strengths": strengths,
        "improvement_suggestions": improvements
    }
