import os
import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/hivemind_db")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin@ssdc.sliet")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin2026")

def init_database():
    print("🚀 Initializing HiveMind 2026 MongoDB Atlas Database...")
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        try:
            db = client.get_database()
            if not db.name or db.name in ["test", "admin"]:
                db = client["hivemind_db"]
        except Exception:
            db = client["hivemind_db"]

        # Ping server
        client.admin.command("ping")
        print(f"✅ Connected to MongoDB Atlas: '{db.name}'")

        # 1. Create Indexes
        db.users.create_index([("emailId", 1)], unique=True)
        db.users.create_index([("regNo", 1)])
        db.users.create_index([("phoneNumber", 1)])
        db.registrations.create_index([("userId", 1)])
        db.registrations.create_index([("submissionId", 1)], unique=True)
        db.results.create_index([("eventId", 1)], unique=True)
        db.admin_users.create_index([("username", 1)], unique=True)
        print("✅ Database Indexes Initialized.")

        # 2. Upsert Admin User in MongoDB Atlas from .env
        admin_doc = {
            "username": ADMIN_USERNAME.lower(),
            "password": ADMIN_PASSWORD,
            "role": "admin",
            "updatedAt": datetime.datetime.utcnow().isoformat()
        }

        db.admin_users.update_one(
            {"username": ADMIN_USERNAME.lower()},
            {"$set": admin_doc},
            upsert=True
        )
        print(f"👑 Admin Account Saved in MongoDB Atlas `admin_users` collection!")
        print(f"   Username: {ADMIN_USERNAME}")
        print(f"   Role: admin")

        # 3. Seed events from database.py
        from database import DEFAULT_EVENTS
        if db.events.count_documents({}) == 0:
            db.events.insert_many(DEFAULT_EVENTS)
            print("🏆 Seeded official events into MongoDB Atlas `events` collection.")
        else:
            print("ℹ️ Events collection already contains documents, skipping seed.")

        print("🎉 Database Setup Complete!")
        return True

    except Exception as err:
        print(f"⚠️ Initialization Notice: {err}")
        return False

if __name__ == "__main__":
    init_database()
