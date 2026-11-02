from services.ai_matching import normalize_skill

DEFAULT_PROFICIENCY_MAP = {
    "beginner": 30,
    "intermediate": 65,
    "advanced": 90,
    "expert": 100
}

def analyze_skill_gap(student_profile, target_skills, custom_proficiencies=None):
    """
    Compares student's current skills against target skills required by an opportunity or role.
    Computes proficiency levels, gap deficit, and tailored improvement suggestions.
    """
    student_skills = student_profile.get("skills", [])
    if not student_skills and student_profile.get("technical_skills"):
        student_skills = student_profile.get("technical_skills", [])
        
    custom_proficiencies = custom_proficiencies or student_profile.get("skill_proficiencies", {})
    
    student_norm_map = {}
    for s in student_skills:
        student_norm_map[normalize_skill(s)] = s
        
    skill_breakdown = []
    missing_skills = []
    current_skills_analyzed = []
    
    total_required = len(target_skills) if target_skills else 1
    total_acquired_score = 0
    
    for req in target_skills:
        req_norm = normalize_skill(req)
        is_acquired = False
        proficiency = 0
        
        # Check custom override first
        if req in custom_proficiencies:
            proficiency = int(custom_proficiencies[req])
            is_acquired = True
        else:
            for s_norm, s_orig in student_norm_map.items():
                if req_norm == s_norm or req_norm in s_norm or s_norm in req_norm:
                    is_acquired = True
                    # Default estimated proficiency if acquired
                    proficiency = int(custom_proficiencies.get(s_orig, 75))
                    break
                    
        if is_acquired:
            current_skills_analyzed.append(req)
            total_acquired_score += (proficiency / 100.0)
        else:
            missing_skills.append(req)
            proficiency = int(custom_proficiencies.get(req, 15)) # entry exposure
            
        skill_breakdown.append({
            "skill": req,
            "acquired": is_acquired,
            "proficiency": proficiency,
            "benchmark_required": 75,
            "gap": max(0, 75 - proficiency),
            "status": "Ready" if proficiency >= 70 else ("In Progress" if proficiency >= 40 else "Needs Focus")
        })
        
    overall_readiness_pct = round((total_acquired_score / total_required) * 100, 1)
    
    # Generate tailored improvement suggestions
    suggestions = []
    high_priority_gaps = [item["skill"] for item in skill_breakdown if item["gap"] >= 35]
    if high_priority_gaps:
        suggestions.append({
            "priority": "High",
            "title": f"Bridge Core Technical Deficit: {', '.join(high_priority_gaps[:2])}",
            "description": f"Focus the next 2-3 weeks on {', '.join(high_priority_gaps[:2])} by building a practical project and completing beginner-to-intermediate labs."
        })
    moderate_gaps = [item["skill"] for item in skill_breakdown if 15 <= item["gap"] < 35]
    if moderate_gaps:
        suggestions.append({
            "priority": "Medium",
            "title": f"Level-Up Competency: {', '.join(moderate_gaps[:2])}",
            "description": f"Solidify existing knowledge in {', '.join(moderate_gaps[:2])} to pass technical interview screening rounds."
        })
    if not suggestions:
        suggestions.append({
            "priority": "Low",
            "title": "Interview Simulation & Portfolio Polish",
            "description": "Your skill proficiencies match or exceed benchmarks! Practice live system design and coding mock interviews."
        })
        
    return {
        "overall_readiness_pct": overall_readiness_pct,
        "skills_acquired_count": len(current_skills_analyzed),
        "skills_missing_count": len(missing_skills),
        "total_required_count": len(target_skills),
        "current_skills": current_skills_analyzed,
        "missing_skills": missing_skills,
        "skill_breakdown": skill_breakdown,
        "suggestions": suggestions
    }
