# Ad Campaign Intelligence Dashboard 🚀

A modern, highly-interactive web application built to analyze and monitor advertising campaigns in real-time. This project features a robust analytics dashboard paired with a state-of-the-art **Neural AI Analyst** that can answer questions based on your live campaign data.

## ✨ Features

### 📊 Comprehensive Dashboard (Command Deck)
- **Metric Cards:** Real-time summary of Total Campaigns, Active Campaigns, Budget, and Click-Through Rate (CTR).
- **Sales Trends:** Interactive charts (using Recharts) to track clicks versus purchases over time.
- **Platform & Category Distribution:** Visual breakdown of ad placements across different social media platforms and ad types.

### 📈 Campaign Insights
- Drill-down functionality to view specific campaign performance.
- Expandable cards showing detailed platform metrics, CPA, CTR, and CVR percentages.
- Dynamic filtering by campaign status (Active vs. Completed).

### 🗃️ Archives (Data Table)
- Complete historical record of all advertising campaigns.
- Features include robust debounced searching, column sorting, and pagination for seamless data exploration.

### 🤖 Integrated AI Analyst
- **Context-Aware Chatbot:** Powered by Google's GenAI (Gemini/Gemma), the AI knows your database schema and current active dashboard filters.
- **Model Selector:** Switch dynamically between various models like `gemini-2.5-flash-lite`, `gemma-3-27b-it`, `gemma-3-12b-it`, etc., directly from the UI.
- **Interactive Probes:** Auto-shuffling prompt suggestions to help you analyze data quickly.
- **Live Markdown Parsing:** Cleanly renders AI responses without breaking the sleek dashboard aesthetic.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Recharts.
- **Backend:** Python, FastAPI, SQLAlchemy (SQLite), Google Generative AI SDK.
- **Architecture:** Decoupled REST API architecture with a dynamic parameter passing system for AI context.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- Python (3.9+ recommended)
- A Google Gemini API Key

### 1. Backend Setup (FastAPI)
1. Buka terminal dan navigasikan ke folder `backend`:
   ```bash
   cd backend
   ```
2. Buat dan aktifkan Virtual Environment (opsional namun direkomendasikan):
   ```bash
   python -m venv venv
   
   # Untuk macOS dan Linux:
   source venv/bin/activate
   
   # Untuk Windows:
   venv\Scripts\activate
   ```
3. Install semua *dependencies*:
   ```bash
   pip install -r requirements.txt
   ```
4. Buat file `.env` di dalam folder `backend` dan masukkan API Key Anda:
   ```env
   GOOGLE_API_KEY=masukkan_api_key_anda_disini
   ```
5. Jalankan server backend:
   ```bash
   uvicorn main:app --reload
   ```
   *Server akan berjalan di `http://localhost:8000`*

### 2. Frontend Setup (React + Vite)
1. Buka terminal baru dan navigasikan ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Install semua *dependencies* NPM:
   ```bash
   npm install
   ```
3. Jalankan server *development*:
   ```bash
   npm run dev
   ```
   *Aplikasi dapat diakses melalui link lokal yang diberikan Vite (biasanya `http://localhost:5173`)*

---

## 🎨 Design Philosophy
The application features a premium "Dark Glassmorphism" aesthetic with deep violet and neon purple accents (`#1a1a2e`, `violet-500`), specifically tailored for data analysts working in dark-mode environments.

## 📝 License
This project is for educational and portfolio demonstration purposes.
