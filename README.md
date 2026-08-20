# 🌐 SSDC HIVEMIND 2026 — Official Tech Festival Platform

> **Organized by Software Development Club (SSDC), SLIET Longowal**  
> **Total Cumulative Prize Pool: ₹20,000** 🏆

Welcome to the official repository for **HiveMind 2026**, a premier cyber-themed technical festival hosted by the **Software Development Club (SSDC)** at **SLIET Longowal**. This full-stack web platform powers participant registrations, direct MongoDB Atlas data storage, live participant dashboards, organizer administrative controls, CSV/Excel exports, and real-time announcement broadcasting.

---

## 🚀 Key Features

### 💻 Participant Experience
- **Interactive Cyberpunk UI**: Built with dynamic grid animations, chamfered futuristic aesthetics, glassmorphism, and responsive design.
- **Direct Event & General Pass Registration**:
  - **Individual Challenge Sign-up**: Quick registration for specific challenges.
  - **All Events / General Pass**: 1-click registration granting full access to all 10 festival challenges.
- **Participant Dashboard (`/dashboard`)**:
  - Live sync of confirmed registrations directly from **MongoDB Atlas**.
  - **VIP General Pass Grid**: Expands into an unlocked 10-challenge grid.
  - **Participant Timeline & Action Items**: Live milestone updates, rulebook links, and direct WhatsApp community verification.
  - **Official Announcement Feed**: Real-time broadcast notices from event organizers with urgency badges.

### 🛡️ Admin & Organizer Controls (`/login?tab=admin` -> `/admin`)
- **MongoDB Atlas Integration**: Direct REST API authentication and querying against the `hivemind_db` cloud database.
- **Event Filtering & Live Search**: Instant searching across participant names, emails, phone numbers, roll numbers, and submission IDs.
- **Dual Format Data Exporter**:
  - **`EXPORT EXCEL (.xlsx)`**: Styled Microsoft Excel spreadsheet with formatted headers and cell borders.
  - **`EXPORT CSV (.csv)`**: Comma-separated spreadsheet download for database backups.
- **Notice & News Broadcasting**: Publish live notices, schedule updates, or urgent alerts directly to user dashboards (`POST /api/admin/notices`).
- **Winner & Results Publisher**: Publish 1st, 2nd, and 3rd place winners alongside judge notes to the public arena (`POST /api/admin/results`).

---

## 🎪 Festival Challenges (10 Official Events)

| # | Event Code | Challenge Title | Domain / Category |
|---|---|---|---|
| **01** | `HM-EV01` | **BAD UI** | Front-End Anti-Pattern & Intentional Worst UX Design |
| **02** | `HM-EV02` | **WEB CRAFT** | Full-Stack Modern Web & Cyberpunk Interface Building |
| **03** | `HM-EV03` | **BUG HUNT** | Code Auditing, Penetration Testing & Debugging |
| **04** | `HM-EV04` | **ALGO QUEST** | Competitive Programming & Algorithmic Optimization |
| **05** | `HM-EV05` | **CODE HEIST** | Time-Constrained Hackathon & Speed Coding |
| **06** | `HM-EV06` | **TECH QUIZ** | Computer Science & Cyber Security Trivia |
| **07** | `HM-EV07` | **UI/UX SHOWDOWN** | Figma Prototyping & Product Design Challenge |
| **08** | `HM-EV08` | **POSTER CRAFT** | Digital Graphic Design & Tech Poster Creation |
| **09** | `HM-EV09` | **SYS HACK** | Linux System Administration & Shell Scripting |
| **10** | `HM-EV10` | **AI REVOLUTION** | Machine Learning, LLM Prompting & GenAI Applications |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS / Vanilla CSS, Framer Motion, Lucide Icons
- **Backend**: Python 3, Flask REST API, Flask-CORS, PyJWT, Gunicorn (Production WSGI)
- **Database**: MongoDB Atlas Cloud (`hivemind_db`)
- **Deployment**: Render.com (Backend) / Firebase Hosting / Vercel / Netlify (Frontend)

---

## 📁 Repository Structure

```text
hivemind-2026/
├── backend/                  # Python Flask REST API Backend
│   ├── app.py                # Main Flask server with MongoDB Atlas endpoints
│   ├── init_db.py            # MongoDB Atlas admin initializer & sync script
│   ├── requirements.txt      # Python dependencies (Flask, PyMongo, Gunicorn)
│   ├── Procfile              # Render web process startup configuration
│   ├── render.yaml           # Render Blueprint configuration
│   ├── runtime.txt           # Python version runtime (3.10.12)
│   └── .env.example          # Environment variable template
├── src/                      # React 18 Frontend Source Code
│   ├── components/           # Navbar, Footer, Hero, Event Cards, Modals
│   ├── context/              # AuthContext for session & registration state
│   ├── data/                 # Event details, dates, rules, config
│   ├── pages/                # Home, Events, Register, Login, Dashboard, Admin
│   ├── services/             # ApiService (REST API client for Flask & Atlas)
│   └── App.tsx               # Main Router and Page Layouts
├── .gitignore                # Root gitignore rules
├── index.html                # Vite HTML entry point
└── package.json              # Frontend scripts & Node dependencies
```

---

## ⚙️ Local Development Setup

### 1. Backend Setup (Flask + MongoDB Atlas)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (.env)
cp .env.example .env
```

Ensure `backend/.env` contains your MongoDB Atlas URI:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.w2y0s.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=hivemind_super_secret_jwt_key_2026_ssdc
PORT=5000
ADMIN_USERNAME=ssdc.sliet.hivemind
ADMIN_PASSWORD=!ssdc@hive@admin420
```

Start the Flask Backend:
```bash
python app.py
```
*Backend will run on `http://localhost:5000`.*

---

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```
*Frontend will run on `http://localhost:5173`.*

---

## ☁️ Deployment

### Backend Deployment (Render.com)
The repository contains ready-to-use configuration files ([`backend/Procfile`](file:///d:/Project/ssdc/hivemind-2026/backend/Procfile), [`backend/render.yaml`](file:///d:/Project/ssdc/hivemind-2026/backend/render.yaml), [`backend/requirements.txt`](file:///d:/Project/ssdc/hivemind-2026/backend/requirements.txt)).

1. Push your code to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Create a **New Web Service** pointing to your repository.
4. Set **Root Directory** to `backend`.
5. Set **Start Command** to `gunicorn app:app`.
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`.

---

## 📢 Community & Contact

- **WhatsApp Community**: [Join SSDC WhatsApp Group](https://chat.whatsapp.com/BsDg3RV0N2A6zpeRSfHhwT?s=qt&p=a&ilr=4)
- **Instagram**: [@ssdc.sliet](https://www.instagram.com/ssdc.sliet/)
- **LinkedIn**: [SLIET Software Development Club](https://www.linkedin.com/company/sliet-software-developement-club/)
- **Official Website**: [https://ssdc.web.app](https://ssdc.web.app)
- **Google Group**: [https://groups.google.com/g/ssdc-sliet](https://groups.google.com/g/ssdc-sliet)

---

### 📜 License
Developed by the **Software Development Club (SSDC), SLIET Longowal**. All rights reserved.
