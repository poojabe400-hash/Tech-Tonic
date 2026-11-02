def calculate_career_readiness(student_profile, simulated_additions=None):
    """
    Computes an illustrative Career Readiness Score (0 to 100) based on:
    - Technical skills volume & depth (weight: 35%)
    - Hands-on practical projects (weight: 25%)
    - Industry certifications (weight: 15%)
    - Profile & Resume completeness (weight: 15%)
    - Active learning & roadmap milestones (weight: 10%)
    
    Supports 'simulated_additions' for what-if scenarios (e.g. adding 2 skills + 1 project).
    """
    simulated_additions = simulated_additions or {}
    
    # 1. Skills (35 pts max)
    base_skills = set(student_profile.get("skills", []) + student_profile.get("technical_skills", []))
    simulated_skills = set(simulated_additions.get("skills", []))
    total_skills = base_skills.union(simulated_skills)
    
    skill_count = len(total_skills)
    if skill_count >= 10:
        skill_score = 35
    elif skill_count >= 7:
        skill_score = 30
    elif skill_count >= 5:
        skill_score = 25
    elif skill_count >= 3:
        skill_score = 18
    elif skill_count >= 1:
        skill_score = 10
    else:
        skill_score = 2
        
    # 2. Projects (25 pts max)
    base_projects = list(student_profile.get("projects", []))
    simulated_projects_count = int(simulated_additions.get("projects_count", 0))
    total_projects_count = len(base_projects) + simulated_projects_count
    
    if total_projects_count >= 4:
        project_score = 25
    elif total_projects_count == 3:
        project_score = 22
    elif total_projects_count == 2:
        project_score = 18
    elif total_projects_count == 1:
        project_score = 12
    else:
        project_score = 0
        
    # 3. Certifications (15 pts max)
    base_certs = list(student_profile.get("certifications", []))
    simulated_certs_count = int(simulated_additions.get("certifications_count", 0))
    total_certs = len(base_certs) + simulated_certs_count
    
    if total_certs >= 3:
        cert_score = 15
    elif total_certs == 2:
        cert_score = 12
    elif total_certs == 1:
        cert_score = 8
    else:
        cert_score = 0
        
    # 4. Profile & Resume Completeness (15 pts max)
    profile_fields = [
        bool(student_profile.get("college")),
        bool(student_profile.get("degree")),
        bool(student_profile.get("branch")),
        bool(student_profile.get("graduation_year")),
        bool(student_profile.get("github_url")),
        bool(student_profile.get("linkedin_url")),
        bool(student_profile.get("resume_id") or student_profile.get("has_resume"))
    ]
    completed_fields = sum(1 for f in profile_fields if f)
    profile_completeness_score = round((completed_fields / len(profile_fields)) * 15)
    
    # 5. Learning Progress (10 pts max)
    base_learning_pct = student_profile.get("learning_progress_pct", 20)
    simulated_learning_boost = int(simulated_additions.get("learning_progress_boost", 0))
    effective_learning_pct = min(100, base_learning_pct + simulated_learning_boost)
    learning_score = round((effective_learning_pct / 100) * 10)
    
    # Total Score
    total_score = min(100, skill_score + project_score + cert_score + profile_completeness_score + learning_score)
    
    # Improvement recommendations
    recommendations = []
    if skill_count < 6:
        recommendations.append("Add 3+ technical skills in your core domain to boost your readiness by up to +12 points.")
    if total_projects_count < 2:
        recommendations.append("Build and link at least 2 practical GitHub projects to earn up to +13 points.")
    if total_certs < 1:
        recommendations.append("Complete 1 verified free certification course (e.g. Kaggle, FreeCodeCamp, MongoDB) for +8 points.")
    if not (student_profile.get("resume_id") or student_profile.get("has_resume")):
        recommendations.append("Upload and parse your resume in the Resume Analyzer for +5 points.")
    if not student_profile.get("github_url") or not student_profile.get("linkedin_url"):
        recommendations.append("Add your LinkedIn and GitHub URLs to verify your work.")
        
    tier = "Needs Development"
    if total_score >= 85:
        tier = "Job & Hackathon Ready"
    elif total_score >= 70:
        tier = "Competitive Candidate"
    elif total_score >= 50:
        tier = "Developing Foundations"
        
    return {
        "score": total_score,
        "max_score": 100,
        "tier": tier,
        "breakdown": {
            "skills": {"score": skill_score, "max": 35, "label": "Technical Skills"},
            "projects": {"score": project_score, "max": 25, "label": "Portfolio Projects"},
            "certifications": {"score": cert_score, "max": 15, "label": "Certifications"},
            "profile_completeness": {"score": profile_completeness_score, "max": 15, "label": "Profile & Resume Completeness"},
            "learning_progress": {"score": learning_score, "max": 10, "label": "Roadmap Milestones"}
        },
        "stats": {
            "skills_count": skill_count,
            "projects_count": total_projects_count,
            "certifications_count": total_certs,
            "profile_completeness_pct": round((completed_fields / len(profile_fields)) * 100)
        },
        "recommendations": recommendations,
        "disclaimer": "This readiness score is an educational guide to help you build a well-rounded portfolio. It does not calculate or guarantee automated hiring outcomes."
    }
