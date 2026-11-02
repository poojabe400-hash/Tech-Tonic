def generate_learning_roadmap(target_role="Full Stack Developer", missing_skills=None, existing_skills=None):
    """
    Generates a structured, personalized 6-week learning roadmap customized to
    the student's target role and specific missing skills, prioritizing free and high-quality resources.
    """
    missing_skills = missing_skills or []
    existing_skills = existing_skills or []
    
    role_lower = str(target_role).lower()
    
    # Base Curricula templates
    if "data" in role_lower or "ai" in role_lower or "machine learning" in role_lower:
        base_weeks = [
            {
                "week": 1,
                "title": "Python for Data Analysis & Scientific Computing",
                "focus_skills": [s for s in missing_skills if s.lower() in ["python", "numpy", "pandas"]] or ["Python", "Pandas"],
                "duration": "8-10 hours",
                "tasks": [
                    "Master Pandas DataFrame transformations, indexing, and grouping",
                    "Handle missing values and explore datasets with NumPy & Seaborn",
                    "Complete Kaggle Python & Pandas micro-courses"
                ],
                "resources": [
                    {"name": "Kaggle Python Course (Free)", "url": "https://www.kaggle.com/learn/python", "type": "Interactive Course"},
                    {"name": "Pandas Documentation & Cookbook", "url": "https://pandas.pydata.org/docs/", "type": "Documentation"}
                ]
            },
            {
                "week": 2,
                "title": "SQL Mastery & Relational Database Queries",
                "focus_skills": [s for s in missing_skills if s.lower() in ["sql", "mysql", "postgresql"]] or ["SQL"],
                "duration": "7-9 hours",
                "tasks": [
                    "Write complex multi-table JOINs, subqueries, and window functions",
                    "Practice 15 SQL query challenges on LeetCode / HackerRank",
                    "Understand database normalization and query execution plans"
                ],
                "resources": [
                    {"name": "SQLBolt - Learn SQL Interactively", "url": "https://sqlbolt.com/", "type": "Interactive Tutorial"},
                    {"name": "Mode Analytics SQL Tutorial", "url": "https://mode.com/sql-tutorial/", "type": "Tutorial"}
                ]
            },
            {
                "week": 3,
                "title": "Machine Learning Foundations & Scikit-Learn",
                "focus_skills": [s for s in missing_skills if s.lower() in ["machine learning", "scikit-learn", "stats"]] or ["Scikit-learn"],
                "duration": "10-12 hours",
                "tasks": [
                    "Train Supervised models: Regression, Decision Trees, Random Forests",
                    "Implement train-test splits, cross-validation, and metrics (RMSE, F1, ROC-AUC)",
                    "Prevent data leakage and tune hyperparameters using GridSearchCV"
                ],
                "resources": [
                    {"name": "Scikit-Learn Official User Guide", "url": "https://scikit-learn.org/stable/user_guide.html", "type": "Docs & Tutorials"},
                    {"name": "Google Machine Learning Crash Course", "url": "https://developers.google.com/machine-learning/crash-course", "type": "Free Course"}
                ]
            },
            {
                "week": 4,
                "title": "Deep Learning Basics / Advanced NLP & Vision",
                "focus_skills": [s for s in missing_skills if s.lower() in ["tensorflow", "pytorch", "nlp", "deep learning"]] or ["PyTorch"],
                "duration": "10-12 hours",
                "tasks": [
                    "Understand Neural Network architectures and backpropagation",
                    "Implement a classification model in PyTorch / Hugging Face Transformers",
                    "Fine-tune a pre-trained open model for sentiment analysis or text classification"
                ],
                "resources": [
                    {"name": "Hugging Face NLP Course (Free)", "url": "https://huggingface.co/learn/nlp-course", "type": "Interactive Course"},
                    {"name": "Fast.ai Practical Deep Learning", "url": "https://course.fast.ai/", "type": "Video Course"}
                ]
            },
            {
                "week": 5,
                "title": "Model Evaluation, MLOps & API Deployment",
                "focus_skills": ["Flask", "FastAPI", "Docker", "Model Serving"],
                "duration": "8-10 hours",
                "tasks": [
                    "Wrap trained model into a REST API endpoint using Flask or FastAPI",
                    "Containerize the inference service with Docker",
                    "Test endpoints with Postman and write automated unit tests"
                ],
                "resources": [
                    {"name": "FastAPI Official Tutorial", "url": "https://fastapi.tiangolo.com/tutorial/", "type": "Documentation"},
                    {"name": "Docker 101 Tutorial", "url": "https://www.docker.com/101-tutorial/", "type": "Interactive"}
                ]
            },
            {
                "week": 6,
                "title": "End-to-End Capstone Project & Portfolio Submission",
                "focus_skills": ["Project Architecture", "GitHub Portfolio", "Documentation"],
                "duration": "12-14 hours",
                "tasks": [
                    "Build an end-to-end predictive dashboard solving a real-world problem",
                    "Write a professional README with architectural diagram, metrics, and demo link",
                    "Record a 2-minute walkthrough video and link on LinkedIn"
                ],
                "resources": [
                    {"name": "GitHub Student Developer Pack (Free)", "url": "https://education.github.com/pack", "type": "Developer Tools"}
                ]
            }
        ]
    elif "frontend" in role_lower or "react" in role_lower:
        base_weeks = [
            {
                "week": 1,
                "title": "HTML5 Semantic Structure & Modern CSS/Tailwind",
                "focus_skills": ["HTML5", "CSS3", "Tailwind CSS"],
                "duration": "6-8 hours",
                "tasks": [
                    "Master Flexbox, CSS Grid, and responsive layout patterns",
                    "Implement mobile-first design with utility-first Tailwind CSS",
                    "Follow accessibility (a11y) standards: semantic tags and ARIA"
                ],
                "resources": [
                    {"name": "Tailwind CSS Docs", "url": "https://tailwindcss.com/docs", "type": "Documentation"},
                    {"name": "MDN Web Docs - HTML/CSS", "url": "https://developer.mozilla.org/", "type": "Tutorial"}
                ]
            },
            {
                "week": 2,
                "title": "Modern JavaScript (ES6+) Core & Async Patterns",
                "focus_skills": ["JavaScript", "Promises", "Async/Await"],
                "duration": "8-10 hours",
                "tasks": [
                    "Master closures, destructuring, modules, and array methods",
                    "Deep dive into Promises, async/await, and Fetch API error handling",
                    "Implement a live weather dashboard consuming public REST APIs"
                ],
                "resources": [
                    {"name": "JavaScript.info", "url": "https://javascript.info/", "type": "Comprehensive Guide"}
                ]
            },
            {
                "week": 3,
                "title": "React.js Component Architecture & Hooks",
                "focus_skills": ["React.js", "useState", "useEffect", "Custom Hooks"],
                "duration": "10-12 hours",
                "tasks": [
                    "Build reusable functional components and manage props/state",
                    "Implement custom hooks for API caching and responsive window size",
                    "Understand component lifecycle and dependency arrays"
                ],
                "resources": [
                    {"name": "React Official Docs (react.dev)", "url": "https://react.dev/learn", "type": "Interactive Course"}
                ]
            },
            {
                "week": 4,
                "title": "State Management, Routing & Data Fetching",
                "focus_skills": ["React Router", "Context API", "Axios"],
                "duration": "8-10 hours",
                "tasks": [
                    "Implement multi-page navigation with React Router v6",
                    "Set up global auth state with React Context / Zustand",
                    "Handle loading states, empty states, and toast notifications"
                ],
                "resources": [
                    {"name": "React Router Documentation", "url": "https://reactrouter.com/", "type": "Documentation"}
                ]
            },
            {
                "week": 5,
                "title": "TypeScript & Performance Optimization",
                "focus_skills": ["TypeScript", "Code Splitting", "Vite"],
                "duration": "9-11 hours",
                "tasks": [
                    "Add TypeScript interfaces, types, and generic props to React components",
                    "Optimize rendering with useMemo, useCallback, and React.lazy",
                    "Audit with Chrome Lighthouse for 90+ performance scores"
                ],
                "resources": [
                    {"name": "TypeScript for React Developers", "url": "https://react-typescript-cheatsheet.netlify.app/", "type": "Cheatsheet"}
                ]
            },
            {
                "week": 6,
                "title": "Production Frontend Capstone & Deployment",
                "focus_skills": ["Vercel/Netlify", "CI/CD", "Portfolio Showcase"],
                "duration": "10-12 hours",
                "tasks": [
                    "Build a complete SaaS landing page with dark/light mode and interactive charts",
                    "Deploy to Vercel with automatic GitHub preview builds",
                    "Add comprehensive testing and live demo links"
                ],
                "resources": [
                    {"name": "Vercel Zero-Config Deployment", "url": "https://vercel.com/docs", "type": "Platform"}
                ]
            }
        ]
    else:
        # Default: Full Stack Developer / General Software Engineer
        base_weeks = [
            {
                "week": 1,
                "title": "Web Foundations & Responsive UI Development",
                "focus_skills": [s for s in missing_skills if s.lower() in ["html", "css", "tailwind", "bootstrap"]] or ["HTML/CSS", "Tailwind CSS"],
                "duration": "7-9 hours",
                "tasks": [
                    "Master responsive UI layouts using Flexbox and Grid",
                    "Build accessible, semantic components with high contrast",
                    "Implement interactive mobile navigation and modal drawers"
                ],
                "resources": [
                    {"name": "FreeCodeCamp Responsive Web Design", "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/", "type": "Free Certification"}
                ]
            },
            {
                "week": 2,
                "title": "Modern JavaScript & TypeScript Fundamentals",
                "focus_skills": [s for s in missing_skills if s.lower() in ["javascript", "typescript", "es6"]] or ["JavaScript", "TypeScript"],
                "duration": "9-11 hours",
                "tasks": [
                    "Master ES6+ syntax, asynchronous programming, and event loops",
                    "Strongly type data models and API contracts with TypeScript",
                    "Write robust client-side validation logic"
                ],
                "resources": [
                    {"name": "JavaScript.info", "url": "https://javascript.info/", "type": "Guide"}
                ]
            },
            {
                "week": 3,
                "title": "Frontend Frameworks: React & State Management",
                "focus_skills": [s for s in missing_skills if s.lower() in ["react", "vue", "angular", "next.js"]] or ["React.js"],
                "duration": "10-12 hours",
                "tasks": [
                    "Build modular components and manage complex state flows",
                    "Implement client-side routing, protected routes, and authentication hooks",
                    "Integrate interactive data visualization graphs"
                ],
                "resources": [
                    {"name": "React.dev Learn Tutorial", "url": "https://react.dev/learn", "type": "Interactive Documentation"}
                ]
            },
            {
                "week": 4,
                "title": "Backend Engineering: Flask / Node.js & REST APIs",
                "focus_skills": [s for s in missing_skills if s.lower() in ["python", "flask", "node.js", "express", "fastapi"]] or ["Python Flask", "REST APIs"],
                "duration": "10-12 hours",
                "tasks": [
                    "Architect RESTful endpoints with consistent JSON payloads and error codes",
                    "Implement token authentication and role-based permission checks",
                    "Write unit tests for API endpoints using pytest or supertest"
                ],
                "resources": [
                    {"name": "Flask Mega-Tutorial (Free)", "url": "https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world", "type": "Tutorial Series"}
                ]
            },
            {
                "week": 5,
                "title": "Databases & ORM/ODM Integration (MongoDB & SQL)",
                "focus_skills": [s for s in missing_skills if s.lower() in ["mongodb", "sql", "postgresql", "mysql"]] or ["MongoDB", "SQL"],
                "duration": "8-10 hours",
                "tasks": [
                    "Design scalable schemas with indexing and relationship models",
                    "Perform aggregation pipelines and optimize slow queries",
                    "Implement data validation and automated migration scripts"
                ],
                "resources": [
                    {"name": "MongoDB University (Free)", "url": "https://learn.mongodb.com/", "type": "Free Certification"}
                ]
            },
            {
                "week": 6,
                "title": "Full Stack Integration, Docker & Cloud Deployment",
                "focus_skills": ["Docker", "Git/GitHub", "Cloud Hosting", "CI/CD"],
                "duration": "12-14 hours",
                "tasks": [
                    "Connect React frontend with Flask backend using environment configs",
                    "Containerize services and prepare clean documentation in README",
                    "Present the project as a demonstrable hackathon submission"
                ],
                "resources": [
                    {"name": "Full Stack Open (University of Helsinki - Free)", "url": "https://fullstackopen.com/en/", "type": "Comprehensive Course"}
                ]
            }
        ]

    # Initialize completed status for each week
    for item in base_weeks:
        item["completed"] = False
        item["completed_tasks"] = []
        
    return {
        "target_role": target_role,
        "total_weeks": len(base_weeks),
        "estimated_hours": "55-65 hours",
        "weeks": base_weeks,
        "progress_percentage": 0,
        "missing_skills_targeted": missing_skills
    }
