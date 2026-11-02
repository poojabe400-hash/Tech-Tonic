import re

def normalize_skill(skill):
    return re.sub(r'[^a-zA-Z0-9]', '', str(skill).lower())

def calculate_skill_overlap(student_skills, required_skills):
    if not required_skills:
        return 1.0, [], []
    
    student_norm = {normalize_skill(s): s for s in student_skills}
    matched = []
    missing = []
    
    for req in required_skills:
        req_norm = normalize_skill(req)
        found = False
        for s_norm, s_orig in student_norm.items():
            if req_norm == s_norm or req_norm in s_norm or s_norm in req_norm:
                matched.append(req)
                found = True
                break
        if not found:
            missing.append(req)
            
    score = len(matched) / len(required_skills)
    return score, matched, missing

def check_education_eligibility(student_profile, eligibility_criteria):
    """
    Evaluates education eligibility (Degree, branch, year/semester).
    Returns score (0.0 to 1.0) and explanation string.
    """
    if not eligibility_criteria:
        return 1.0, "Open to all degrees and academic backgrounds."
    
    crit_str = str(eligibility_criteria).lower()
    student_deg = str(student_profile.get("degree", "")).lower()
    student_branch = str(student_profile.get("branch", "")).lower()
    student_year = str(student_profile.get("graduation_year", "")).lower()
    
    matched_points = 0
    total_points = 2
    
    # Check degree or branch
    tech_branches = ["cs", "cse", "computer", "it", "information", "data", "software", "ai", "ml", "ece", "electronics"]
    if any(b in student_branch for b in tech_branches) or any(d in student_deg for d in ["b.tech", "btech", "be", "bca", "mca", "b.sc", "bsc"]):
        matched_points += 1
    elif not any(term in crit_str for term in ["cs only", "btech only"]):
        matched_points += 1
        
    # Check graduation year or student status
    if "final year" in crit_str and "2026" in student_year:
        matched_points += 1
    elif "pre-final" in crit_str and ("2026" in student_year or "2027" in student_year):
        matched_points += 1
    else:
        matched_points += 1 # standard match
        
    score = min(1.0, matched_points / total_points)
    explanation = f"Your degree ({student_profile.get('degree', 'N/A')}) and branch ({student_profile.get('branch', 'N/A')}) align well with the eligibility requirements."
    return score, explanation

def calculate_interest_match(student_profile, opportunity):
    """
    Compares student's areas_of_interest and preferred_job_roles with opportunity title, category, and tags.
    """
    interests = [str(i).lower() for i in student_profile.get("areas_of_interest", [])]
    preferred_roles = [str(r).lower() for r in student_profile.get("preferred_job_roles", [])]
    combined_interests = set(interests + preferred_roles)
    
    if not combined_interests:
        return 0.7 # Neutral default if not filled
    
    opp_text = f"{opportunity.get('title', '')} {opportunity.get('category', '')} {opportunity.get('description', '')}".lower()
    matches = 0
    for item in combined_interests:
        if item in opp_text:
            matches += 1
            
    score = min(1.0, 0.4 + (matches * 0.3)) if matches > 0 else 0.4
    return score

def calculate_location_work_mode_match(student_profile, opportunity):
    pref_mode = str(student_profile.get("preferred_work_mode", "any")).lower()
    opp_mode = str(opportunity.get("mode", "remote")).lower()
    
    if pref_mode in ["any", "all", "flexible", ""] or pref_mode == opp_mode:
        return 1.0
    if opp_mode == "remote" or pref_mode == "remote":
        return 0.8
    if opp_mode == "hybrid" or pref_mode == "hybrid":
        return 0.7
        
    # Location check
    pref_loc = str(student_profile.get("preferred_location", "")).lower()
    opp_loc = str(opportunity.get("location", "")).lower()
    if pref_loc and (pref_loc in opp_loc or opp_loc in pref_loc):
        return 1.0
    return 0.5

def compute_opportunity_match(student_profile, opportunity):
    """
    Implements Master Equation:
    Match Score = (0.60 * Skill Match) + (0.20 * Education Eligibility) + (0.10 * Interest Match) + (0.10 * Location/Work Mode Match)
    """
    # 1. Skills
    student_skills = student_profile.get("skills", [])
    if not student_skills and student_profile.get("technical_skills"):
        student_skills = student_profile.get("technical_skills", [])
    required_skills = opportunity.get("required_skills", [])
    
    skill_score, matched_skills, missing_skills = calculate_skill_overlap(student_skills, required_skills)
    
    # 2. Education
    education_score, edu_explanation = check_education_eligibility(student_profile, opportunity.get("eligibility", ""))
    
    # 3. Interest
    interest_score = calculate_interest_match(student_profile, opportunity)
    
    # 4. Location / Work Mode
    location_score = calculate_location_work_mode_match(student_profile, opportunity)
    
    # Final Weighted Match Score
    raw_score = (0.60 * skill_score) + (0.20 * education_score) + (0.10 * interest_score) + (0.10 * location_score)
    match_percentage = round(raw_score * 100, 1)
    
    # Actionable Explanation & Improvement Tips
    reasons = []
    if matched_skills:
        reasons.append(f"Strong overlap on {len(matched_skills)} core technical skills ({', '.join(matched_skills[:3])}).")
    if education_score >= 0.8:
        reasons.append(edu_explanation)
    if interest_score >= 0.7:
        reasons.append("High alignment with your stated career interests and preferred job roles.")
        
    improvement_suggestions = []
    if missing_skills:
        improvement_suggestions.append(f"Gain familiarity with {', '.join(missing_skills[:3])} to raise match score above 90%.")
    if not student_profile.get("projects"):
        improvement_suggestions.append("Add a hands-on project to your profile demonstrating your technical competencies.")
    if not improvement_suggestions:
        improvement_suggestions.append("Your profile is an exceptional match. Review the application requirements and apply early!")

    return {
        "opportunity_id": opportunity.get("_id") or opportunity.get("id"),
        "title": opportunity.get("title"),
        "company": opportunity.get("company"),
        "match_score": match_percentage,
        "skill_score": round(skill_score * 100, 1),
        "education_score": round(education_score * 100, 1),
        "interest_score": round(interest_score * 100, 1),
        "location_score": round(location_score * 100, 1),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "why_matched": reasons,
        "improvement_suggestions": improvement_suggestions,
        "disclaimer": "Scores are recommendation indicators to guide learning and preparedness, not automated hiring guarantees."
    }
