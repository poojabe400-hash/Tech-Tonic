import os
from app import create_app
from config.settings import config
from seed_data import seed_database

app = create_app()

if __name__ == "__main__":
    # Ensure database is seeded on startup if empty
    seed_database()
    port = int(os.getenv("PORT", config.PORT))
    print(f"\n==================================================")
    print(f"🚀 CareerBridge AI Backend Server running on port {port}")
    print(f"📡 API Health Check: http://127.0.0.1:{port}/api/health")
    print(f"📖 API Documentation: http://127.0.0.1:{port}/api/docs")
    print(f"==================================================\n")
    app.run(host="0.0.0.0", port=port, debug=config.DEBUG)
