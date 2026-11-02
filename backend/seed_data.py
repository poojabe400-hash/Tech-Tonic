import uuid
from datetime import datetime, timedelta
from models.database import db_manager

def seed_database():
    print("[Seed] Checking and seeding realistic demo datasets for hackathon evaluation...")
    
    # 1. Seed Skills (30 technical skills)
    skills_collection = db_manager.skills
    if skills_collection.count_documents() == 0:
        skills_data = [
            {"name": "Python", "category": "Programming Languages", "popular": True},
            {"name": "JavaScript", "category": "Programming Languages", "popular": True},
            {"name": "TypeScript", "category": "Programming Languages", "popular": True},
            {"name": "Java", "category": "Programming Languages", "popular": True},
            {"name": "C++", "category": "Programming Languages", "popular": True},
            {"name": "Go", "category": "Programming Languages", "popular": False},
            {"name": "Rust", "category": "Programming Languages", "popular": False},
            {"name": "SQL", "category": "Programming Languages", "popular": True},
            {"name": "React.js", "category": "Frontend", "popular": True},
            {"name": "Next.js", "category": "Frontend", "popular": True},
            {"name": "Vue.js", "category": "Frontend", "popular": False},
            {"name": "Tailwind CSS", "category": "Frontend", "popular": True},
            {"name": "HTML5 & CSS3", "category": "Frontend", "popular": True},
            {"name": "Node.js", "category": "Backend", "popular": True},
            {"name": "Express.js", "category": "Backend", "popular": True},
            {"name": "Flask", "category": "Backend", "popular": True},
            {"name": "FastAPI", "category": "Backend", "popular": True},
            {"name": "Django", "category": "Backend", "popular": True},
            {"name": "MongoDB", "category": "Databases", "popular": True},
            {"name": "PostgreSQL", "category": "Databases", "popular": True},
            {"name": "Redis", "category": "Databases", "popular": False},
            {"name": "Firebase", "category": "Cloud & BaaS", "popular": True},
            {"name": "Docker", "category": "DevOps", "popular": True},
            {"name": "Kubernetes", "category": "DevOps", "popular": False},
            {"name": "Git & GitHub", "category": "Tools", "popular": True},
            {"name": "AWS Cloud", "category": "Cloud", "popular": True},
            {"name": "Machine Learning", "category": "AI/Data", "popular": True},
            {"name": "Data Structures & Algorithms", "category": "Core CS", "popular": True},
            {"name": "Pandas & NumPy", "category": "AI/Data", "popular": True},
            {"name": "RESTful API Design", "category": "Backend", "popular": True}
        ]
        for s in skills_data:
            s["is_demo"] = True
            skills_collection.insert_one(s)
        print(f"[Seed] Added {len(skills_data)} technical skills.")

    # 2. Seed Opportunities (20 jobs and internships)
    opps_collection = db_manager.opportunities
    if opps_collection.count_documents() == 0:
        now = datetime.utcnow()
        opportunities_data = [
            {
                "title": "Software Engineering Intern",
                "company": "Nexus Innovations (Demo)",
                "category": "Software Engineering",
                "type": "internship",
                "mode": "remote",
                "location": "Bengaluru / Remote",
                "stipend": "₹25,000 / month",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["Python", "Flask", "RESTful API Design", "Git & GitHub"],
                "eligibility": "B.Tech / B.E. / BCA / MCA students graduating 2026 or 2027",
                "description": "Work with our backend engineering team building scalable REST APIs and data processing microservices. Mentorship provided.",
                "deadline": (now + timedelta(days=24)).strftime("%Y-%m-%d"),
                "source": "Verified Partner Network",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Frontend React Developer",
                "company": "CloudPeak Solutions (Demo)",
                "category": "Frontend",
                "type": "job",
                "mode": "hybrid",
                "location": "Hyderabad / Hybrid",
                "stipend": "₹7.5 - 9.0 LPA",
                "experience_level": "intermediate",
                "is_paid": True,
                "required_skills": ["React.js", "JavaScript", "TypeScript", "Tailwind CSS"],
                "eligibility": "Graduating batch of 2026 with strong frontend portfolio",
                "description": "Design responsive, high-performance dashboards for enterprise telemetry systems with modern React and Tailwind.",
                "deadline": (now + timedelta(days=18)).strftime("%Y-%m-%d"),
                "source": "Campus Drive Verified",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": False,
                "is_demo": True
            },
            {
                "title": "AI & Data Science Intern",
                "company": "QuantumPulse Analytics (Demo)",
                "category": "AI / Machine Learning",
                "type": "internship",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹30,000 / month",
                "experience_level": "intermediate",
                "is_paid": True,
                "required_skills": ["Python", "Machine Learning", "Pandas & NumPy", "SQL"],
                "eligibility": "Pre-final and Final year students passionate about predictive modeling",
                "description": "Analyze time-series financial indicators, train predictive models with scikit-learn, and build evaluation pipelines.",
                "deadline": (now + timedelta(days=14)).strftime("%Y-%m-%d"),
                "source": "Industry Partner",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Full Stack Web Developer Intern",
                "company": "AuraTech Studios (Demo)",
                "category": "Full Stack",
                "type": "internship",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹20,000 / month",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["React.js", "Node.js", "MongoDB", "JavaScript"],
                "eligibility": "Open to all branches and years; project demonstration required",
                "description": "Contribute to full-stack features from UI components to database schemas in an agile startup environment.",
                "deadline": (now + timedelta(days=30)).strftime("%Y-%m-%d"),
                "source": "Startup Accelerator Portal",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Cloud & DevOps Trainee",
                "company": "Vanguard Cloud Systems (Demo)",
                "category": "DevOps / Cloud",
                "type": "job",
                "mode": "onsite",
                "location": "Pune, India",
                "stipend": "₹6.5 - 8.0 LPA",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["Docker", "AWS Cloud", "Git & GitHub", "Linux"],
                "eligibility": "Final year engineering students (2026)",
                "description": "Assist in automating deployment pipelines, managing container clusters, and monitoring cloud infrastructure.",
                "deadline": (now + timedelta(days=22)).strftime("%Y-%m-%d"),
                "source": "Direct Campus Recruitment",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Mobile App Development Intern",
                "company": "ByteWave Mobility (Demo)",
                "category": "Mobile",
                "type": "internship",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹18,000 / month",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["React.js", "JavaScript", "TypeScript", "RESTful API Design"],
                "eligibility": "Undergraduate students with at least 1 mobile or web demo project",
                "description": "Develop fluid cross-platform mobile screens and integrate third-party REST services.",
                "deadline": (now + timedelta(days=20)).strftime("%Y-%m-%d"),
                "source": "Verified Partner",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Junior Python Developer",
                "company": "Crestview Labs (Demo)",
                "category": "Backend",
                "type": "job",
                "mode": "hybrid",
                "location": "Noida / Hybrid",
                "stipend": "₹6.0 - 7.5 LPA",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["Python", "Django", "SQL", "Git & GitHub"],
                "eligibility": "Degree in Computer Science or related fields",
                "description": "Build high-throughput backend services and maintain database migrations.",
                "deadline": (now + timedelta(days=19)).strftime("%Y-%m-%d"),
                "source": "Campus Placement Cell",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Open Source Fellow",
                "company": "Global Code Collective (Demo)",
                "category": "Open Source",
                "type": "internship",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹35,000 / month stipend",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["Git & GitHub", "Python", "JavaScript", "HTML5 & CSS3"],
                "eligibility": "Any enrolled college student globally; no prior commercial experience required",
                "description": "Full-time funded open source fellowship contributing to public digital infrastructure.",
                "deadline": (now + timedelta(days=35)).strftime("%Y-%m-%d"),
                "source": "Equalizer Open Source Initiative",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Data Analyst Intern",
                "company": "Apex Insight Media (Demo)",
                "category": "Data Analytics",
                "type": "internship",
                "mode": "remote",
                "location": "Mumbai / Remote",
                "stipend": "₹22,000 / month",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["SQL", "Python", "Pandas & NumPy"],
                "eligibility": "All STEM & Commerce students welcome",
                "description": "Transform customer behavior logs into visual KPI dashboards and actionable business insights.",
                "deadline": (now + timedelta(days=16)).strftime("%Y-%m-%d"),
                "source": "Verified Partner",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Backend Engineering Intern",
                "company": "FinStream Technologies (Demo)",
                "category": "Backend",
                "type": "internship",
                "mode": "hybrid",
                "location": "Gurugram / Hybrid",
                "stipend": "₹28,000 / month",
                "experience_level": "intermediate",
                "is_paid": True,
                "required_skills": ["Java", "SQL", "RESTful API Design", "Data Structures & Algorithms"],
                "eligibility": "B.Tech/BE Computer Science / IT (2026/2027)",
                "description": "Work on payment reconciliation microservices and low-latency transactional flows.",
                "deadline": (now + timedelta(days=25)).strftime("%Y-%m-%d"),
                "source": "Fintech Alliance",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": False,
                "is_demo": True
            },
            {
                "title": "Associate UI/UX & Frontend Engineer",
                "company": "PixelCraft Interactive (Demo)",
                "category": "Frontend",
                "type": "job",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹7.0 - 8.5 LPA",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["React.js", "Tailwind CSS", "JavaScript", "HTML5 & CSS3"],
                "eligibility": "Strong visual design skills and responsive code sample required",
                "description": "Bridge the gap between Figma mockups and fluid, accessible React components.",
                "deadline": (now + timedelta(days=28)).strftime("%Y-%m-%d"),
                "source": "Design Council",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Cybersecurity & Network Intern",
                "company": "Fortress Guard Cyber (Demo)",
                "category": "Cybersecurity",
                "type": "internship",
                "mode": "onsite",
                "location": "Bengaluru",
                "stipend": "₹24,000 / month",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["Python", "Linux", "Data Structures & Algorithms"],
                "eligibility": "Students enrolled in B.Tech, BCA, or Cybersecurity minors",
                "description": "Participate in vulnerability scanning, penetration test reporting, and log anomaly review.",
                "deadline": (now + timedelta(days=21)).strftime("%Y-%m-%d"),
                "source": "Cyber Defense Network",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Machine Learning Research Assistant",
                "company": "NeuralFrontier Labs (Demo)",
                "category": "AI / Machine Learning",
                "type": "internship",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹32,000 / month",
                "experience_level": "intermediate",
                "is_paid": True,
                "required_skills": ["Python", "Machine Learning", "Pandas & NumPy"],
                "eligibility": "Demonstrated academic research or prior ML implementation projects",
                "description": "Run model benchmarking on NLP datasets and draft empirical performance reports.",
                "deadline": (now + timedelta(days=15)).strftime("%Y-%m-%d"),
                "source": "Academic Research Portal",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": False,
                "is_demo": True
            },
            {
                "title": "Graduate Trainee Software Engineer",
                "company": "Synapse Global Tech (Demo)",
                "category": "Software Engineering",
                "type": "job",
                "mode": "onsite",
                "location": "Chennai",
                "stipend": "₹6.2 - 7.8 LPA",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["C++", "Data Structures & Algorithms", "SQL", "Git & GitHub"],
                "eligibility": "Graduating batch of 2026, minimum 6.5 CGPA",
                "description": "Join our 12-week comprehensive graduate engineering program with rotation in platform infrastructure.",
                "deadline": (now + timedelta(days=12)).strftime("%Y-%m-%d"),
                "source": "University Relations",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Full Stack React & Node Intern",
                "company": "Veloce Health (Demo)",
                "category": "Full Stack",
                "type": "internship",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹22,000 / month",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["React.js", "Node.js", "Express.js", "MongoDB"],
                "eligibility": "Pre-final / Final year students with full stack web apps",
                "description": "Help develop telemedicine web portal with appointment booking and secure records.",
                "deadline": (now + timedelta(days=26)).strftime("%Y-%m-%d"),
                "source": "HealthTech Ventures",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "DevOps Junior Associate",
                "company": "Kinetix Cloud (Demo)",
                "category": "DevOps / Cloud",
                "type": "job",
                "mode": "hybrid",
                "location": "Bengaluru / Hybrid",
                "stipend": "₹8.0 - 10.0 LPA",
                "experience_level": "intermediate",
                "is_paid": True,
                "required_skills": ["Docker", "Kubernetes", "AWS Cloud", "Git & GitHub"],
                "eligibility": "2026 graduates with hands-on container and cloud experience",
                "description": "Maintain Kubernetes clusters, automate Helm deployments, and monitor latency metrics.",
                "deadline": (now + timedelta(days=17)).strftime("%Y-%m-%d"),
                "source": "Verified Partner",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": False,
                "is_demo": True
            },
            {
                "title": "Technical Documentation & Community Intern",
                "company": "DevSphere Open Source (Demo)",
                "category": "Developer Relations",
                "type": "internship",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹15,000 / month",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["Git & GitHub", "HTML5 & CSS3", "JavaScript"],
                "eligibility": "Strong communication and interest in open source development",
                "description": "Write clear developer guides, code samples, and assist students in hackathon on-boarding.",
                "deadline": (now + timedelta(days=32)).strftime("%Y-%m-%d"),
                "source": "Equalizer Community Program",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Backend Go Developer Intern",
                "company": "HyperScale Cloud (Demo)",
                "category": "Backend",
                "type": "internship",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹28,000 / month",
                "experience_level": "intermediate",
                "is_paid": True,
                "required_skills": ["Go", "Docker", "RESTful API Design", "PostgreSQL"],
                "eligibility": "Students excited about concurrent low-latency programming",
                "description": "Build asynchronous event consumers and caching layers using Go and Redis.",
                "deadline": (now + timedelta(days=19)).strftime("%Y-%m-%d"),
                "source": "Verified Partner",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": False,
                "is_demo": True
            },
            {
                "title": "QA Automation Engineering Intern",
                "company": "Reliant Software QA (Demo)",
                "category": "QA / Testing",
                "type": "internship",
                "mode": "remote",
                "location": "Remote",
                "stipend": "₹20,000 / month",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["Python", "JavaScript", "Git & GitHub"],
                "eligibility": "B.Tech/BCA/B.Sc students with scripting knowledge",
                "description": "Write end-to-end integration test suites and test automation scripts for CI/CD.",
                "deadline": (now + timedelta(days=27)).strftime("%Y-%m-%d"),
                "source": "QA Guild",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            },
            {
                "title": "Campus Technology Ambassador",
                "company": "NextGen Builders Fellowship (Demo)",
                "category": "Leadership & Tech",
                "type": "internship",
                "mode": "remote",
                "location": "On Campus / Remote",
                "stipend": "₹12,000 / month + Tech Grant",
                "experience_level": "beginner",
                "is_paid": True,
                "required_skills": ["Git & GitHub", "HTML5 & CSS3"],
                "eligibility": "Active 1st, 2nd, or 3rd year college students with campus leadership",
                "description": "Lead coding workshops, organize collegiate hackathons, and represent student builders.",
                "deadline": (now + timedelta(days=40)).strftime("%Y-%m-%d"),
                "source": "Equalizer Student Leadership",
                "last_verified": now.strftime("%Y-%m-%d"),
                "apply_url": None,
                "is_beginner_friendly": True,
                "is_demo": True
            }
        ]
        for opp in opportunities_data:
            opps_collection.insert_one(opp)
        print(f"[Seed] Added {len(opportunities_data)} verified opportunities.")

    # 3. Seed Events & Hackathons (15 items)
    events_collection = db_manager.events
    if events_collection.count_documents() == 0:
        now = datetime.utcnow()
        events_data = [
            {
                "title": "National Smart India Innovation Hackathon 2026",
                "organizer": "Ministry of Education & AICTE (Demo)",
                "category": "Hackathon",
                "format": "Hybrid",
                "location": "New Delhi & Regional Nodal Centers",
                "start_date": (now + timedelta(days=20)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=22)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=12)).strftime("%Y-%m-%d"),
                "eligibility": "College students in teams of 4 to 6 members",
                "fee": "Free of cost",
                "description": "36-hour nationwide hackathon solving hardware and software problem statements from government ministries and industry leaders.",
                "registration_url": "https://example.com/events/national-hackathon-2026",
                "status": "Registration Open",
                "is_demo": True
            },
            {
                "title": "AI Builders Hackfest 2026",
                "organizer": "Google Developer Student Clubs (Demo)",
                "category": "Hackathon",
                "format": "Online",
                "location": "Virtual / Global",
                "start_date": (now + timedelta(days=14)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=16)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=8)).strftime("%Y-%m-%d"),
                "eligibility": "All enrolled college students",
                "fee": "Free of cost",
                "description": "Build innovative AI applications utilizing multimodal APIs, agentic reasoning, and open data to address campus and civic challenges.",
                "registration_url": "https://example.com/events/ai-builders-hackfest",
                "status": "Registration Open",
                "is_demo": True
            },
            {
                "title": "System Design & Clean Code Workshop",
                "organizer": "Tech Tonic Engineering Community (Demo)",
                "category": "Workshop",
                "format": "Online",
                "location": "Live Webinar Stream",
                "start_date": (now + timedelta(days=7)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=7)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=6)).strftime("%Y-%m-%d"),
                "eligibility": "Engineering & CS undergraduates",
                "fee": "Free",
                "description": "A 3-hour hands-on masterclass on scalable microservice design, database indexing, caching strategies, and interview system design.",
                "registration_url": "https://example.com/events/system-design-masterclass",
                "status": "Registration Open",
                "is_demo": True
            },
            {
                "title": "Campus Placement Drive: Cloud & Enterprise Systems",
                "organizer": "National Inter-Collegiate Placement Cell (Demo)",
                "category": "Placement Drive",
                "format": "Online",
                "location": "Virtual Evaluation Portal",
                "start_date": (now + timedelta(days=25)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=27)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=18)).strftime("%Y-%m-%d"),
                "eligibility": "Graduating batch of 2026 (B.Tech, MCA, BCA, B.Sc)",
                "fee": "Free",
                "description": "Multi-company pooled recruitment drive featuring technical assessments, coding evaluations, and live virtual interviews.",
                "registration_url": "https://example.com/events/placement-drive-2026",
                "status": "Upcoming",
                "is_demo": True
            },
            {
                "title": "Women in Tech Coding Championship 2026",
                "organizer": "AnitaB & SheCode Foundation (Demo)",
                "category": "Coding Competition",
                "format": "Online",
                "location": "Online Coding Platform",
                "start_date": (now + timedelta(days=18)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=18)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=11)).strftime("%Y-%m-%d"),
                "eligibility": "Female undergraduate and graduate STEM students",
                "fee": "Free",
                "description": "Competitive programming contest offering prizes, direct interview fast-tracks, and 1-on-1 industry mentorship for winners.",
                "registration_url": "https://example.com/events/women-in-tech-2026",
                "status": "Registration Open",
                "is_demo": True
            },
            {
                "title": "Full Stack Open Source BootCamp",
                "organizer": "FOSS United College Chapters (Demo)",
                "category": "Workshop",
                "format": "Online",
                "location": "Virtual Discord & GitHub Classroom",
                "start_date": (now + timedelta(days=10)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=13)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=7)).strftime("%Y-%m-%d"),
                "eligibility": "Beginners welcome; basic Git familiarity helpful",
                "fee": "Free",
                "description": "4-day immersive weekend bootcamp teaching Git pull requests, CI testing, and contributing your first PR to major open repos.",
                "registration_url": "https://example.com/events/foss-bootcamp-2026",
                "status": "Registration Open",
                "is_demo": True
            },
            {
                "title": "Inter-University Annual Tech Fest 'InnovateX'",
                "organizer": "Apex Institute of Technology (Demo)",
                "category": "College Fest",
                "format": "In-Person",
                "location": "Apex Campus, Bengaluru",
                "start_date": (now + timedelta(days=30)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=32)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=22)).strftime("%Y-%m-%d"),
                "eligibility": "College students with valid college ID card",
                "fee": "₹150 for fest pass",
                "description": "3 days of robotics competitions, pitch battles, paper presentations, capture the flag (CTF), and gaming showdowns.",
                "registration_url": "https://example.com/events/innovatex-fest",
                "status": "Upcoming",
                "is_demo": True
            },
            {
                "title": "Fast-Track DSA & Technical Interview Webinar",
                "organizer": "CareerBridge AI Prep Academy (Demo)",
                "category": "Webinar",
                "format": "Online",
                "location": "Live Interactive Broadcast",
                "start_date": (now + timedelta(days=5)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=5)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=4)).strftime("%Y-%m-%d"),
                "eligibility": "All students preparing for tech campus placements",
                "fee": "Free",
                "description": "Live breakdown of top 25 high-probability coding patterns asked by tier-1 product companies and startups.",
                "registration_url": "https://example.com/events/dsa-webinar-2026",
                "status": "Registration Open",
                "is_demo": True
            },
            {
                "title": "FinTech & Blockchain HackSprint",
                "organizer": "Decentralized Finance Network (Demo)",
                "category": "Hackathon",
                "format": "Online",
                "location": "Online",
                "start_date": (now + timedelta(days=22)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=24)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=15)).strftime("%Y-%m-%d"),
                "eligibility": "Students interested in financial tech and distributed ledgers",
                "fee": "Free",
                "description": "48-hour sprint to build next-generation payment infrastructure, fraud detection tools, and DeFi microservices.",
                "registration_url": "https://example.com/events/fintech-hacksprint",
                "status": "Upcoming",
                "is_demo": True
            },
            {
                "title": "AWS Cloud Foundations Certification Drive",
                "organizer": "AWS Academy & Campus Partners (Demo)",
                "category": "Certification Program",
                "format": "Online",
                "location": "Self-paced + Live Mentorship",
                "start_date": (now + timedelta(days=12)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=26)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=9)).strftime("%Y-%m-%d"),
                "eligibility": "Enrolled college students seeking cloud credentials",
                "fee": "Free training + 50% exam voucher",
                "description": "Two-week guided certification cohort covering S3, EC2, IAM, Lambda, and cloud security architectures.",
                "registration_url": "https://example.com/events/aws-certification-cohort",
                "status": "Registration Open",
                "is_demo": True
            },
            {
                "title": "Cyber Threat Simulation & CTF 2026",
                "organizer": "National Cybersecurity Student League (Demo)",
                "category": "Coding Competition",
                "format": "Online",
                "location": "Virtual CTF Lab",
                "start_date": (now + timedelta(days=16)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=17)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=10)).strftime("%Y-%m-%d"),
                "eligibility": "Students interested in security & reverse engineering",
                "fee": "Free",
                "description": "Capture the Flag tournament with challenges across Web Exploitation, Cryptography, Forensics, and Binary Reversing.",
                "registration_url": "https://example.com/events/cyber-ctf-2026",
                "status": "Registration Open",
                "is_demo": True
            },
            {
                "title": "Google Summer of Code (GSoC) Prep Workshop",
                "organizer": "Campus Open Source Advocates (Demo)",
                "category": "Webinar",
                "format": "Online",
                "location": "Virtual Stream",
                "start_date": (now + timedelta(days=9)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=9)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=8)).strftime("%Y-%m-%d"),
                "eligibility": "Open to all undergraduate students",
                "fee": "Free",
                "description": "Past GSoC contributors and mentors review how to write winning proposals and select suitable organizations.",
                "registration_url": "https://example.com/events/gsoc-prep-masterclass",
                "status": "Registration Open",
                "is_demo": True
            },
            {
                "title": "Machine Learning in Production (MLOps) Conference",
                "organizer": "Data Science Society (Demo)",
                "category": "Tech Conference",
                "format": "Hybrid",
                "location": "Hyderabad Convention Center / Online",
                "start_date": (now + timedelta(days=35)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=36)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=28)).strftime("%Y-%m-%d"),
                "eligibility": "Students and researchers in AI/ML",
                "fee": "Free student virtual pass",
                "description": "Two days of keynote talks from AI research engineers covering LLM deployment, model monitoring, and vector databases.",
                "registration_url": "https://example.com/events/mlops-conference",
                "status": "Upcoming",
                "is_demo": True
            },
            {
                "title": "Startup Pitch Fest & Angel Fair",
                "organizer": "Student Entrepreneurship Cell (Demo)",
                "category": "Career Fair",
                "format": "In-Person",
                "location": "Pune Incubation Center",
                "start_date": (now + timedelta(days=42)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=43)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=31)).strftime("%Y-%m-%d"),
                "eligibility": "Student founders and hiring startups",
                "fee": "Free for students",
                "description": "Pitch your student venture to angel investors or interview for early-stage startup founding engineer roles.",
                "registration_url": "https://example.com/events/startup-pitch-fest",
                "status": "Upcoming",
                "is_demo": True
            },
            {
                "title": "Quantum Computing & Algorithms Workshop",
                "organizer": "National Science Foundation Chapter (Demo)",
                "category": "Workshop",
                "format": "Online",
                "location": "Online Portal",
                "start_date": (now + timedelta(days=29)).strftime("%Y-%m-%d"),
                "end_date": (now + timedelta(days=30)).strftime("%Y-%m-%d"),
                "registration_deadline": (now + timedelta(days=20)).strftime("%Y-%m-%d"),
                "eligibility": "Students with linear algebra and Python foundations",
                "fee": "Free",
                "description": "Hands-on quantum circuit simulation using Qiskit and introductory quantum search algorithms.",
                "registration_url": "https://example.com/events/quantum-computing-workshop",
                "status": "Upcoming",
                "is_demo": True
            }
        ]
        for ev in events_data:
            events_collection.insert_one(ev)
        print(f"[Seed] Added {len(events_data)} verified hackathons and events.")

    # 4. Seed Learning Resources (10 items for Career GPS & Equalizer)
    res_collection = db_manager.learning_resources
    if res_collection.count_documents() == 0:
        resources_data = [
            {"title": "FreeCodeCamp Full Stack Certification", "platform": "FreeCodeCamp", "url": "https://www.freecodecamp.org/", "category": "Web Development", "is_free": True, "cost": "100% Free", "description": "300 hours of hands-on interactive frontend and backend curriculum with verified certificates."},
            {"title": "CS50: Introduction to Computer Science", "platform": "Harvard / edX", "url": "https://cs50.harvard.edu/x/", "category": "Core CS", "is_free": True, "cost": "Free Audit", "description": "World-renowned introductory computer science course covering C, Python, SQL, and algorithms."},
            {"title": "Kaggle Python & Machine Learning Micro-Courses", "platform": "Kaggle Learn", "url": "https://www.kaggle.com/learn", "category": "Data & AI", "is_free": True, "cost": "100% Free", "description": "Bite-sized interactive Jupyter notebook courses in Python, Pandas, and Scikit-Learn."},
            {"title": "The Odin Project - Full Stack JavaScript", "platform": "The Odin Project", "url": "https://www.theodinproject.com/", "category": "Web Development", "is_free": True, "cost": "100% Free", "description": "Open-source curriculum taking you from zero to full stack developer through real projects."},
            {"title": "MongoDB University: Python & Node Developer Paths", "platform": "MongoDB", "url": "https://learn.mongodb.com/", "category": "Databases", "is_free": True, "cost": "100% Free", "description": "Official interactive courses with free certification voucher opportunities."},
            {"title": "Fast.ai Practical Deep Learning for Coders", "platform": "Fast.ai", "url": "https://course.fast.ai/", "category": "AI / Deep Learning", "is_free": True, "cost": "100% Free", "description": "Top-down pragmatic deep learning course teaching PyTorch and modern architectures."},
            {"title": "SQLBolt - Interactive SQL Lessons", "platform": "SQLBolt", "url": "https://sqlbolt.com/", "category": "Databases", "is_free": True, "cost": "100% Free", "description": "Learn SQL directly in your browser with interactive sandboxed database exercises."},
            {"title": "Roadmap.sh - Developer Roadmaps", "platform": "Roadmap.sh", "url": "https://roadmap.sh/", "category": "Career Roadmaps", "is_free": True, "cost": "100% Free", "description": "Community-driven visual step-by-step career path guides for frontend, backend, devops, and AI."},
            {"title": "GitHub Student Developer Pack", "platform": "GitHub Education", "url": "https://education.github.com/pack", "category": "Developer Tools", "is_free": True, "cost": "Free for Students", "description": "Over $200k in free cloud credits, domain names, GitHub Copilot, and developer tooling."},
            {"title": "MDN Web Docs Learning Area", "platform": "Mozilla", "url": "https://developer.mozilla.org/en-US/docs/Learn", "category": "Web Development", "is_free": True, "cost": "100% Free", "description": "Authoritative documentation and structured beginner guides for modern web standards."}
        ]
        for r in resources_data:
            r["is_demo"] = True
            res_collection.insert_one(r)
        print(f"[Seed] Added {len(resources_data)} learning resources.")

    # 5. Seed Scholarships (5 items for Opportunity Equalizer)
    scholarships_collection = db_manager.scholarships
    if scholarships_collection.count_documents() == 0:
        scholarships_data = [
            {
                "title": "Google Generation Scholarship (APAC)",
                "provider": "Google Diversity in STEM",
                "amount": "$2,500 USD grant",
                "eligibility": "Women enrolled in undergraduate or graduate computer science degrees",
                "deadline": "2026-12-15",
                "application_url": "https://buildyourfuture.withgoogle.com/scholarships",
                "category": "Women in Tech & Diversity",
                "description": "Awarded to female students excelling in technology who demonstrate leadership and passion for computer science.",
                "is_demo": True
            },
            {
                "title": "National Meritorious STEM Fellowship",
                "provider": "Department of Science and Technology (Demo)",
                "amount": "₹50,000 / year + Project Grant",
                "eligibility": "B.Tech / B.Sc / BCA students with 7.5+ CGPA and demonstrated research interest",
                "deadline": "2026-11-30",
                "application_url": "https://example.com/scholarships/dst-merit",
                "category": "Merit-Based STEM",
                "description": "Government fellowship supporting high-potential tech students from tier-2 and tier-3 colleges.",
                "is_demo": True
            },
            {
                "title": "GitHub Octernship & Open Source Grant",
                "provider": "GitHub Education",
                "amount": "Paid project stipend ($500 - $1,500/mo)",
                "eligibility": "Verified college students actively contributing to open source repositories",
                "deadline": "2026-12-30",
                "application_url": "https://education.github.com/students",
                "category": "Open Source & Developer Grants",
                "description": "Practical fellowships connecting student builders with industry partner open-source codebases.",
                "is_demo": True
            },
            {
                "title": "Grace Hopper Celebration Student Scholar Award",
                "provider": "AnitaB.org",
                "amount": "Full conference travel & registration grant",
                "eligibility": "Female undergraduate and graduate computing students",
                "deadline": "2026-11-20",
                "application_url": "https://ghc.anitab.org/",
                "category": "Conference & Travel Grant",
                "description": "Covers registration and attendance at the world's largest gathering of women technologists.",
                "is_demo": True
            },
            {
                "title": "First-Generation College Tech Innovators Fund",
                "provider": "Equalizer Philanthropy Network (Demo)",
                "amount": "₹35,000 laptop / hardware grant",
                "eligibility": "First-generation university students pursuing software or hardware engineering",
                "deadline": "2026-12-10",
                "application_url": "https://example.com/scholarships/first-gen",
                "category": "Financial Accessibility",
                "description": "Direct hardware and internet subsidy to bridge the digital divide for aspiring student engineers.",
                "is_demo": True
            }
        ]
        for sc in scholarships_data:
            scholarships_collection.insert_one(sc)
        print(f"[Seed] Added {len(scholarships_data)} scholarship opportunities.")

    # 6. Seed Primary Demo Accounts
    users_collection = db_manager.users
    profiles_collection = db_manager.student_profiles

    # Demo Student
    demo_student_email = "demo.student@careerbridge.ai"
    student_user = users_collection.find_one({"email": demo_student_email})
    student_uid = "student-demo-id"
    if not student_user:
        users_collection.insert_one({
            "uid": student_uid,
            "email": demo_student_email,
            "name": "Aarav Sharma",
            "role": "student",
            "college": "National Institute of Technology",
            "is_verified": True,
            "created_at": datetime.utcnow().isoformat()
        })
        print(f"[Seed] Created demo student user ({demo_student_email}).")

    student_profile = profiles_collection.find_one({"$or": [{"user_id": student_uid}, {"email": demo_student_email}]})
    if not student_profile:
        profiles_collection.insert_one({
            "user_id": student_uid,
            "email": demo_student_email,
            "full_name": "Aarav Sharma",
            "college": "National Institute of Technology",
            "degree": "Bachelor of Technology (B.Tech)",
            "branch": "Computer Science & Engineering",
            "current_semester": "6th Semester",
            "graduation_year": "2026",
            "skills": ["Python", "Flask", "React.js", "JavaScript", "SQL", "Git & GitHub", "HTML5 & CSS3"],
            "technical_skills": ["Python", "Flask", "React.js", "JavaScript", "SQL", "Git & GitHub"],
            "soft_skills": ["Problem Solving", "Team Leadership", "Technical Writing"],
            "skill_proficiencies": {
                "Python": 80,
                "SQL": 65,
                "React.js": 70,
                "Flask": 75,
                "JavaScript": 70,
                "Git & GitHub": 85,
                "Data Structures & Algorithms": 60,
                "Docker": 30,
                "Machine Learning": 40
            },
            "projects": [
                {
                    "title": "Campus Marketplace & Resource Hub",
                    "description": "Built full stack web application with React and Flask allowing college students to exchange books and project equipment.",
                    "technologies": ["React.js", "Flask", "SQL", "Tailwind CSS"],
                    "github_url": "https://github.com/aaravsharma/campus-hub",
                    "live_url": "https://campushub-demo.vercel.app"
                },
                {
                    "title": "Algorithmic Trading Backtester",
                    "description": "Python data analysis tool evaluating moving average crossover strategies on historical stock tick data.",
                    "technologies": ["Python", "Pandas", "NumPy", "Matplotlib"],
                    "github_url": "https://github.com/aaravsharma/algo-backtest"
                }
            ],
            "certifications": [
                {
                    "name": "Full Stack Web Development",
                    "issuer": "FreeCodeCamp",
                    "issue_date": "2025-08-15",
                    "credential_url": "https://freecodecamp.org/certification/aarav/full-stack"
                }
            ],
            "areas_of_interest": ["Full Stack Engineering", "Cloud Computing", "AI Application Development"],
            "preferred_job_roles": ["Software Engineering Intern", "Full Stack Developer", "Backend Developer"],
            "preferred_work_mode": "remote",
            "preferred_location": "Bengaluru",
            "career_goals": "Secure a challenging software engineering internship at an innovative tech startup or product company.",
            "linkedin_url": "https://linkedin.com/in/aarav-sharma-demo",
            "github_url": "https://github.com/aaravsharma-demo",
            "portfolio_url": "https://aaravsharma.dev",
            "learning_progress_pct": 45,
            "has_resume": True,
            "created_at": datetime.utcnow().isoformat()
        })
        print(f"[Seed] Created demo student profile for Aarav Sharma.")

    # Demo Admin
    demo_admin_email = "admin@careerbridge.ai"
    admin_user = users_collection.find_one({"email": demo_admin_email})
    if not admin_user:
        users_collection.insert_one({
            "uid": "admin-demo-id",
            "email": demo_admin_email,
            "name": "Dr. Sunita Sen (Admin)",
            "role": "admin",
            "college": "CareerBridge Central Administration",
            "is_verified": True,
            "created_at": datetime.utcnow().isoformat()
        })
        print(f"[Seed] Created demo admin user ({demo_admin_email}).")

    # 7. Seed Sample 9 other Student Profiles (to reach 10 sample profiles as required by prompt)
    if profiles_collection.count_documents() <= 1:
        sample_students = [
            ("Priya Patel", "priya.p@univ.edu", "IIT Bombay", "B.Tech", "Electrical Engineering", ["Python", "Machine Learning", "PyTorch", "C++"], ["QuantumPulse Analytics (Demo)"]),
            ("Rohan Gupta", "rohan.g@univ.edu", "BITS Pilani", "B.Tech", "Computer Science", ["React.js", "TypeScript", "Node.js", "Docker"], ["Nexus Innovations (Demo)"]),
            ("Ananya Rao", "ananya.r@univ.edu", "IIIT Hyderabad", "B.Tech", "Information Technology", ["Java", "Spring Boot", "SQL", "AWS Cloud"], []),
            ("Vikram Singh", "vikram.s@univ.edu", "Delhi Technological University", "B.Tech", "Mechanical Eng", ["Python", "SQL", "Pandas & NumPy"], []),
            ("Sneha Roy", "sneha.r@univ.edu", "Jadavpur University", "MCA", "Computer Applications", ["React.js", "Tailwind CSS", "JavaScript"], []),
            ("Kavita Nair", "kavita.n@univ.edu", "Anna University", "B.Tech", "Computer Science", ["Python", "Data Structures & Algorithms", "C++"], []),
            ("Aditya Verma", "aditya.v@univ.edu", "VIT Vellore", "B.Tech", "Information Science", ["Docker", "Kubernetes", "AWS Cloud", "Linux"], []),
            ("Meera Joshi", "meera.j@univ.edu", "Pune Institute of Computer Tech", "B.E.", "Computer Engineering", ["Python", "Flask", "MongoDB"], []),
            ("Karan Malhotra", "karan.m@univ.edu", "Thapar University", "B.Tech", "Electronics & Comm", ["JavaScript", "HTML5 & CSS3", "React.js"], [])
        ]
        for name, email, college, deg, branch, skills_list, _ in sample_students:
            uid = str(uuid.uuid4())
            profiles_collection.insert_one({
                "user_id": uid,
                "email": email,
                "full_name": name,
                "college": college,
                "degree": deg,
                "branch": branch,
                "current_semester": "6th Semester",
                "graduation_year": "2026",
                "skills": skills_list,
                "technical_skills": skills_list,
                "projects": [{"title": f"{name}'s Capstone Project", "technologies": skills_list[:2]}],
                "areas_of_interest": ["Software Development"],
                "preferred_work_mode": "remote",
                "is_demo": True
            })
        print(f"[Seed] Added 9 diverse sample student profiles (total: 10 profiles).")

    # 8. Seed Initial Notifications for Demo Student
    notif_collection = db_manager.notifications
    if notif_collection.count_documents({"user_id": student_uid}) == 0:
        notifications_data = [
            {
                "user_id": student_uid,
                "title": "Welcome to CareerBridge AI!",
                "message": "Explore matching opportunities and test your Career Readiness Score in the dashboard.",
                "category": "system",
                "is_read": False,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "user_id": student_uid,
                "title": "National Smart India Hackathon Registration Open",
                "message": "Registration deadline approaching in 12 days. Teams of 4-6 members eligible.",
                "category": "event",
                "is_read": False,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "user_id": student_uid,
                "title": "New High Match Opportunity: Nexus Innovations",
                "message": "Software Engineering Intern role matches 88% of your Python and Flask skills.",
                "category": "opportunity",
                "is_read": False,
                "created_at": datetime.utcnow().isoformat()
            }
        ]
        for n in notifications_data:
            notif_collection.insert_one(n)
        print(f"[Seed] Added demo notifications.")

    # 9. Seed Sample Application
    app_collection = db_manager.applications
    if app_collection.count_documents({"user_id": student_uid}) == 0:
        sample_opp = db_manager.opportunities.find_one({"title": "Software Engineering Intern"})
        if sample_opp:
            app_collection.insert_one({
                "user_id": student_uid,
                "opportunity_id": sample_opp.get("_id"),
                "title": sample_opp.get("title"),
                "company": sample_opp.get("company"),
                "type": sample_opp.get("type"),
                "status": "Under Review",
                "applied_date": datetime.utcnow().strftime("%Y-%m-%d"),
                "notes": "Completed initial screening quiz; waiting for round 2 technical discussion.",
                "is_demo": True
            })
            print("[Seed] Seeded sample application tracker entry.")

    print("[Seed] Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
