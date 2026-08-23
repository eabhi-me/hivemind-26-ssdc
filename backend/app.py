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
CORS(app, resources={r"/api/*": {"origins": "*"}})

PORT = int(os.getenv("PORT", 5000))

# Register Blueprints
app.register_blueprint(public_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)

if __name__ == "__main__":
    print(f"🚀 Starting HiveMind 2026 REST API on http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
