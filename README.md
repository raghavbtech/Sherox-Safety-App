# 🚨 SheRox: AI-Powered Women's Safety Web App

SheRox is a safety-focused web application built during a hackathon to empower and protect users, especially women, using AI-powered real-time features like distress detection, SOS alerts, safe routing, and more.

---

## 🔧 Features

### ✅ Core Functionalities
- AI Distress Detection: Detects distress based on voice pitch and facial expressions via webcam.
- Voice-Activated SOS: Trigger SOS alert by screaming or using a secret keyword.
- Vehicle Number Plate Scanner: OCR-based scanner to detect and track suspicious vehicles.
- SafeRoute Navigator: Suggests safer walking/driving routes based on crime and lighting data.
- Safety Circle: Add trusted contacts and send alerts to them.
- Offline SOS Alerts: Trigger emergency SMS alerts using system APIs (Planned).
- Settings Page: Customize trigger keyword for silent SOS alerts.

---

## 📁 Project Structure

sherox/
│
├── sherox-frontend/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── utils/
│ └── App.js
│
├── sherox-backend/ # Flask backend
│ ├── app.py
│ ├── routes/
│ ├── models/
│ ├── database.py
│ └── requirements.txt
│
└── README.md


---

## ⚙️ Installation & Running Instructions

### 🔽 1. Clone the Repo

```bash
It looks like you've provided a set of instructions for setting up a full-stack application with a Flask backend and a React frontend. I can definitely repeat those instructions for you\!

Here they are:

-----

## Setting Up Your Sherox Application

### 1\. Clone the Repository and Navigate

```bash
git clone https://github.com/your-username/sherox.git
cd sherox
```

-----

### 2Backend Setup (Flask + SQLite + SQLAlchemy)

#### a. Navigate to Backend Folder

```bash
cd sherox-backend
```

#### b. Create Virtual Environment & Activate

```bash
python -m venv venv
source venv/bin/activate         # For Linux/Mac
venv\Scripts\activate            # For Windows
```

#### c. Install Dependencies

```bash
pip install -r requirements.txt
```

#### d. Run the Backend Server

```bash
python app.py
```

*Server should start at `http://localhost:5000`*

-----

### 3\. Frontend Setup (React)

#### a. Navigate to Frontend Folder

```bash
cd ../sherox-frontend
```

#### b. Install Node Modules

```bash
npm install
```

#### c. Run the Frontend

```bash
npm start
```

*App will run at `http://localhost:3000`*

🔑 Google Maps API Setup
Get your Maps API key from: Google Cloud Console.

In RoutePlanner.js, replace:

js
Copy
Edit
const apiKey = "YOUR_API_KEY"; // Can't give API Key

🧠 AI & Detection Modules
~Voice Distress: Uses Web Audio API to analyze pitch.
~Trigger Delay: SOS gets activated if distress continues for more than 5 seconds.


🛠️Build & Deployment
Render Deployment
Backend is hosted on Render:

Ensure requirements.txt is present.

Entry point: app.py

Python Version: 3.10+

Web Service: Flask, Port: 5000

📬 API Endpoints Summary
| Endpoint                | Method   | Description             |
| ----------------------- | -------- | ----------------------- |
| `/api/register`         | POST     | Register user           |
| `/api/login`            | POST     | User login              |
| `/api/trusted-contacts` | GET/POST | Manage trusted contacts |
| `/api/sos`              | POST     | Trigger SOS             |
| `/api/route`            | POST     | Get safe route          |
| `/api/plate-scan`       | POST     | Scan vehicle plate      |


