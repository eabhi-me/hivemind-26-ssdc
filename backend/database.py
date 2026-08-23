import os
import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/hivemind_db")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin@ssdc.sliet").lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin2026")

# In-Memory Backup Store (Used if MongoDB Atlas is connecting or offline)
LOCAL_USERS = []
LOCAL_REGISTRATIONS = []
LOCAL_RESULTS = []
LOCAL_NOTICES = []

DEFAULT_EVENTS = [
    {
        "id": "bad-ui",
        "number": "EVENT_01",
        "title": "BAD UI",
        "tagline": "DESIGN CHAOS.",
        "description": "A chaotic design and development challenge. Participants create the most uniquely frustrating, unintuitive, but technically functional user interface possible.",
        "format": "Take-home project",
        "duration": "5 Days",
        "startDate": "To Be Announced",
        "endDate": "To Be Announced",
        "isoStartDate": "2026-09-01T00:00:00Z",
        "prizePool": "₹3,000",
        "prizeAmountNumeric": 3000,
        "registrationOpen": True,
        "isOnline": True,
        "status": "UPCOMING"
    },
    {
        "id": "reverse-ai",
        "number": "EVENT_02",
        "title": "REVERSE AI-NGINEERING",
        "tagline": "PROMPT THE IMPOSSIBLE.",
        "description": "A fast-paced live prompt-engineering battle. Participants are shown complex AI-generated images or short videos and must replicate the media as closely as possible using a single text prompt.",
        "format": "In-person live event",
        "duration": "2–3 Hours",
        "startDate": "To Be Announced",
        "endDate": "To Be Announced",
        "isoStartDate": "2026-09-17T14:00:00Z",
        "prizePool": "₹3,000",
        "prizeAmountNumeric": 3000,
        "registrationOpen": True,
        "isOnline": True,
        "status": "UPCOMING"
    },
    {
        "id": "pseudo-breach",
        "number": "EVENT_03",
        "title": "PSEUDO-BREACH",
        "tagline": "HACK THE SANDBOX.",
        "description": "A beginner-friendly Web Hacking/CTF event. Participants connect to a demo terminal and attempt to exploit a sandbox website using 'C- (C minus)', a fantasy scripting syntax created specifically for this event.",
        "format": "Weekend hackathon style",
        "duration": "24 Hours",
        "startDate": "To Be Announced",
        "endDate": "To Be Announced",
        "isoStartDate": "2026-09-18T18:00:00Z",
        "prizePool": "₹3,500",
        "prizeAmountNumeric": 3500,
        "registrationOpen": True,
        "isOnline": True,
        "status": "UPCOMING"
    },
    {
        "id": "mind-over-majority",
        "number": "EVENT_04",
        "title": "MIND OVER MAJORITY",
        "tagline": "OUTSMART THE CROWD.",
        "description": "A massive multiplayer Game Theory experiment. Participants receive a form containing 100 psychological/statistical questions. The objective is to accurately predict crowd behavior and outsmart the majority.",
        "format": "Asynchronous",
        "duration": "48 Hours",
        "startDate": "To Be Announced",
        "endDate": "To Be Announced",
        "isoStartDate": "2026-09-23T12:00:00Z",
        "prizePool": "₹4,000",
        "prizeAmountNumeric": 4000,
        "registrationOpen": True,
        "isOnline": True,
        "status": "UPCOMING"
    },
    {
        "id": "algo-arena",
        "number": "EVENT_05",
        "title": "ALGO-ARENA",
        "tagline": "CODE FOR GLORY.",
        "description": "The grand finale. A high-stakes Competitive Programming contest hosted on Codeforces.",
        "format": "Live Competitive Programming Contest",
        "duration": "3 Hours",
        "startDate": "To Be Announced",
        "endDate": "To Be Announced",
        "isoStartDate": "2026-09-27T17:00:00Z",
        "prizePool": "₹4,000",
        "prizeAmountNumeric": 4000,
        "registrationOpen": True,
        "isOnline": True,
        "status": "UPCOMING"
    }
]

LOCAL_EVENTS = list(DEFAULT_EVENTS)

client = None
db = None
mongo_error_msg = None

# Initialize MongoDB Connection safely
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    try:
        db = client.get_database()
        if not db.name or db.name in ["test", "admin"]:
            db = client["hivemind_db"]
    except Exception:
        db = client["hivemind_db"]

    # Test server connection ping
    client.admin.command("ping")
    print(f"✅ Connected to HiveMind Cloud Core Database: '{db.name}'")

except Exception as err:
    mongo_error_msg = str(err)
    print(f"⚠️ Database Connection Notice: {err}")
    print("ℹ️ Operating with automatic local store fallback until Cloud Vault connects.")
    db = None
