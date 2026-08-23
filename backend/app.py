import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

import database

# Import blueprints
from routes.auth_routes import auth_bp
from routes.public_routes import public_bp
from routes.admin_routes import admin_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Restrict CORS to known frontend origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://hivemind-2026.vercel.app",
    "https://hivemind2026.vercel.app",
    "https://hivemind-ssdc.vercel.app",
    "*",
]
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})

PORT = int(os.getenv("PORT", 5000))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

# Register Blueprints
app.register_blueprint(public_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)

if __name__ == "__main__":
    print(f"🚀 Starting HiveMind 2026 REST API on http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=FLASK_DEBUG)
