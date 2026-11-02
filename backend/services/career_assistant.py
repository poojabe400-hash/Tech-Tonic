import json
import requests
from config.settings import config
from models.database import db_manager
from services.ai_matching import compute_opportunity_match

def ask_career_assistant(student_profile, user_message, conversation_history=None):
    """
    Context-aware AI Career Assistant grounded in student's actual profile,
    skills, saved items, and verified platform opportunities and events.
    """
    user_query = user_message.strip().lower()
    student_skills = student_profile.get("skills", [])
    student_name = student_profile.get("full_name") or student_profile.get("name", "Student")
    degree = student_profile.get("degree", "Engineering/Tech")
    branch = student_profile.get("branch", "Computer Science")
    
    # 1. Check if Gemini API is available and configured
    if config.GEMINI_API_KEY:
        try:
            # Prepare context
            opps_sample = list(db_manager.opportunities.find({}, limit=5))
            events_sample = list(db_manager.events.find({}, limit=5))
            
            context_prompt = f"""
You are the CareerBridge AI Assistant for {student_name}.
Student Details:
- Degree: {degree}, Branch: {branch}
- Current Skills: {', '.join(student_skills) if student_skills else 'None listed yet'}
- Target Role / Interests: {', '.join(student_profile.get('areas_of_interest', []))}

Current Verified Platform Opportunities:
{json.dumps([{'title': o.get('title'), 'company': o.get('company'), 'mode': o.get('mode'), 'skills': o.get('required_skills', [])} for o in opps_sample], indent=1)}

Current Verified Platform Events:
{json.dumps([{'title': e.get('title'), 'category': e.get('category'), 'dates': f"{e.get('start_date')} to {e.get('end_date')}"} for e in events_sample], indent=1)}

Rules:
1. Ground your answer strictly in the student's profile and the platform data above.
2. Never invent fake companies, vacancies, salaries, or non-existent event dates.
3. If an answer cannot be determined from verified data, say so clearly.
4. Keep advice actionable, encouraging, and focused on skill development.
"""
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={config.GEMINI_API_KEY}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": context_prompt + f"\nStudent Question: {user_message}"}]}
                ]
            }
            resp = requests.post(url, json=payload, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "reply": text,
                    "source": "CareerBridge AI Assistant (Gemini Engine)",
                    "suggested_actions": ["Explore Opportunities", "View Skill Gap", "View Career GPS"]
                }
        except Exception as e:
            print(f"[Career Assistant] Gemini API call skipped/fallback: {e}")

    # 2. Intelligent Grounded Semantic Reasoning Engine
    # Queries about internships / jobs
    if any(k in user_query for k in ["internship", "job", "best for my skills", "opportunity", "match"]):
        all_opps = list(db_manager.opportunities.find({}, limit=10))
        scored = []
        for o in all_opps:
            match = compute_opportunity_match(student_profile, o)
            scored.append((match["match_score"], o, match))
        scored.sort(key=lambda x: x[0], reverse=True)
        
        if scored:
            top_match = scored[0]
            reply = f"Based on your current skill profile ({', '.join(student_skills[:4]) if student_skills else 'starting profile'}), your highest matching opportunity right now is:\n\n"
            reply += f"🎯 **{top_match[1].get('title')}** at **{top_match[1].get('company')}** (Match Score: **{top_match[0]}%**)\n"
            reply += f"• **Location/Mode:** {top_match[1].get('mode', 'Remote').title()} - {top_match[1].get('location')}\n"
            if top_match[2]["matched_skills"]:
                reply += f"• **Skills you have:** {', '.join(top_match[2]['matched_skills'])}\n"
            if top_match[2]["missing_skills"]:
                reply += f"• **Skills to learn:** {', '.join(top_match[2]['missing_skills'])}\n"
            reply += f"\n💡 You can find more verified opportunities in the **Jobs & Internships** module and inspect the exact deficit in the **Skill Gap Analyzer**."
            return {
                "reply": reply,
                "source": "CareerBridge Opportunity Matcher",
                "suggested_actions": ["View My Skill Gap", "Jobs & Internships", "Career GPS"]
            }
        else:
            return {
                "reply": "There are currently no active opportunity listings in the database. Please check back soon or visit the Jobs & Internships section.",
                "source": "CareerBridge Verified Store",
                "suggested_actions": ["Explore Opportunities"]
            }

    # Queries about skills to learn next
    elif any(k in user_query for k in ["skill", "learn next", "missing", "gap", "what should i learn"]):
        opps = list(db_manager.opportunities.find({}, limit=5))
        all_needed = []
        for o in opps:
            all_needed.extend(o.get("required_skills", []))
            
        student_skills_lower = [s.lower() for s in student_skills]
        gaps = [s for s in set(all_needed) if s.lower() not in student_skills_lower]
        
        reply = f"Hello {student_name}! To maximize your campus-to-employment readiness in {degree} ({branch}), here are the highest-impact skills to prioritize next:\n\n"
        if gaps:
            for idx, g in enumerate(gaps[:4], 1):
                reply += f"{idx}. **{g}** — Heavily requested by current software and developer listings on the platform.\n"
        else:
            reply += "1. **System Design & Clean APIs** — Solidify your backend architecture.\n2. **Cloud/Docker Deployment** — Essential for production deployment.\n"
        reply += "\n🗺️ You can generate a custom 6-week week-by-week learning roadmap in the **Career GPS** module!"
        return {
            "reply": reply,
            "source": "CareerBridge Skill Intelligence",
            "suggested_actions": ["Generate Learning Roadmap", "Skill Gap Analyzer"]
        }

    # Queries about hackathons / events
    elif any(k in user_query for k in ["hackathon", "event", "competition", "workshop", "fest", "webinar"]):
        events = list(db_manager.events.find({}, limit=4))
        if events:
            reply = f"Here are the top upcoming hackathons and events on CareerBridge AI:\n\n"
            for ev in events:
                reply += f"🏆 **{ev.get('title')}**\n"
                reply += f"• **Type:** {ev.get('category')} | **Mode:** {ev.get('format', 'Online')}\n"
                reply += f"• **Dates:** {ev.get('start_date')} to {ev.get('end_date')} | **Deadline:** {ev.get('registration_deadline')}\n\n"
            reply += "You can filter by category or save them to your calendar in the **Hackathons & Events** module."
            return {
                "reply": reply,
                "source": "CareerBridge Events Desk",
                "suggested_actions": ["Hackathons & Events", "Saved Events"]
            }
        else:
            return {
                "reply": "No upcoming events found currently in the database. New events are published regularly by college chapters and organizers.",
                "source": "CareerBridge Events Desk",
                "suggested_actions": ["Hackathons & Events"]
            }

    # Queries about resume improvement
    elif any(k in user_query for k in ["resume", "cv", "improve resume"]):
        reply = f"To optimize your resume for applicant tracking systems (ATS) and tech recruiters:\n\n"
        reply += "1. **Quantify Accomplishments:** Use the XYZ formula — *'Accomplished [X] as measured by [Y], by doing [Z]'*.\n"
        reply += "2. **Prominently Feature GitHub & Portfolio Links:** Ensure every major project has a live link and clean README.\n"
        reply += "3. **Align Core Technical Skills:** Keep skills organized by category (Languages, Frameworks, Cloud/Databases).\n"
        reply += "4. **Upload to our Resume Analyzer:** Our built-in **Resume Analyzer** will parse your PDF, extract your confirmed skills, and identify missing keywords automatically!"
        return {
            "reply": reply,
            "source": "CareerBridge Resume Advisory",
            "suggested_actions": ["Upload Resume", "Career Readiness Simulator"]
        }

    # Technical interview preparation
    elif any(k in user_query for k in ["interview", "prepare", "dsa", "coding round"]):
        reply = "Here is a proven 3-phase technical interview prep strategy:\n\n"
        reply += "• **Data Structures & Algorithms (DSA):** Practice high-frequency patterns (Two Pointers, Sliding Window, DFS/BFS, Binary Search, Dynamic Programming) on LeetCode/NeetCode.\n"
        reply += "• **Core CS Fundamentals:** Review OS concurrency/threading, DBMS indexing & transactions (ACID), and Computer Networks (HTTP/TCP).\n"
        reply += "• **Behavioral (STAR Method):** Prepare 3 stories about handling project bugs, team conflicts, and tight hackathon deadlines using Situation, Task, Action, Result.\n\n"
        reply += "Would you like a personalized 6-week roadmap to structure this preparation?"
        return {
            "reply": reply,
            "source": "CareerBridge Interview Coach",
            "suggested_actions": ["Career GPS", "Skill Gap Analyzer"]
        }

    # Free courses & scholarships
    elif any(k in user_query for k in ["scholarship", "free course", "certification", "equalizer"]):
        reply = "CareerBridge AI provides a dedicated **Opportunity Equalizer** module designed specifically for accessible, free, and beginner-friendly career pathways:\n\n"
        reply += "• **Free Certifications:** FreeCodeCamp (Full Stack), Kaggle (Python & ML), and MongoDB University.\n"
        reply += "• **Verified Scholarships:** Check our Scholarships & Programs directory for STEM and diversity grants.\n"
        reply += "• **Zero-Cost Mentorship:** Open-source contribution programs like Google Summer of Code and GirlScript Summer of Code."
        return {
            "reply": reply,
            "source": "CareerBridge Opportunity Equalizer",
            "suggested_actions": ["Opportunity Equalizer", "Scholarships & Programs"]
        }

    # General fallback
    else:
        reply = f"Hello {student_name}! I am your CareerBridge AI Assistant. I can help you discover matching internships, analyze missing skills, structure a week-by-week learning roadmap, find upcoming hackathons, or prepare for technical interviews.\n\n"
        reply += "Try asking:\n"
        reply += "• *'Which internship is best for my skills?'*\n"
        reply += "• *'What skills should I learn next?'*\n"
        reply += "• *'Which upcoming hackathons can I participate in?'*\n"
        reply += "• *'How can I improve my resume?'*"
        return {
            "reply": reply,
            "source": "CareerBridge AI Assistant",
            "suggested_actions": ["Explore Opportunities", "Skill Gap Analyzer", "Career GPS"]
        }
