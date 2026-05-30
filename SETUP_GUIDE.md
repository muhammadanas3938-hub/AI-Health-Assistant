# 🩺 AI Health Assistant — Setup Guide (Windows)

## Prerequisites

Make sure you have these installed:

- **Node.js** (v18 or higher) → https://nodejs.org (download the LTS version)
- A terminal: use **Command Prompt**, **PowerShell**, or **Windows Terminal**

---

## Step 1 — Get a Free Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (looks like: `AIzaSy...`)

---

## Step 2 — Set Up the Backend

Open a terminal and navigate into the backend folder:

```
cd ai-health-assistant\backend
```

Install dependencies:

```
npm install
```

Open the `.env` file and replace the placeholder with your key:

```
API_KEY=AIzaSyYOUR_ACTUAL_KEY_HERE
PORT=3001
```

Start the backend server:

```
node server.js
```

✅ You should see:
```
✅ AI Health Assistant backend running on http://localhost:3001
```

**Keep this terminal open.**

---

## Step 3 — Set Up the Frontend

Open a **second terminal** and navigate to the frontend folder:

```
cd ai-health-assistant\frontend
```

Install dependencies:

```
npm install
```

Start the frontend dev server:

```
npm run dev
```

✅ You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

## Step 4 — Open the App

Go to your browser and open:

```
http://localhost:5173
```

---

## App Pages

| Page | URL | Description |
|------|-----|-------------|
| 🩺 Symptoms (User) | `/` | Enter symptoms, get AI health guidance |
| 📋 My History (Client) | `/client` | View all previous consultations |
| 🛡️ Admin | `/admin` | View & delete all queries |

---

## Project Structure

```
ai-health-assistant/
├── backend/
│   ├── server.js          ← Express server + Gemini API integration
│   ├── package.json
│   └── .env               ← Your API key goes here
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx        ← App entry point
        ├── App.jsx         ← Router + Navigation
        ├── App.css         ← All styles
        ├── index.css       ← Global base styles
        └── pages/
            ├── UserPage.jsx    ← Symptom input + AI response
            ├── AdminPage.jsx   ← Admin: view/delete queries
            └── ClientPage.jsx  ← Client: history dashboard
```

---

## How It Works

```
Browser (React)
     │
     │ POST /api/chat { symptoms: "..." }
     ▼
Express Server (Node.js :3001)
     │
     │ fetch() to Gemini API
     ▼
Google Gemini 1.5 Flash
     │
     │ AI response
     ▼
Express Server
     │  (stores in memory array)
     │ returns { response: "..." }
     ▼
Browser → Displays result
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `node` is not recognized | Install Node.js from nodejs.org |
| `Cannot connect to backend` | Make sure `node server.js` is running |
| `API error 400/403` | Check your API key in `.env` is correct |
| Port 3001 already in use | Change `PORT=3002` in `.env` |
| Frontend blank page | Check browser console for errors |

---

## Running for Your Presentation

Keep **two terminals** open side by side:

**Terminal 1 (Backend):**
```
cd ai-health-assistant\backend
node server.js
```

**Terminal 2 (Frontend):**
```
cd ai-health-assistant\frontend
npm run dev
```

Then visit → **http://localhost:5173**

---

*Built with Express.js + React + Vite + Google Gemini API*
