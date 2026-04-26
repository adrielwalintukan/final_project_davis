import os
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import google.generativeai as genai
from database import get_db
from dotenv import load_dotenv

# Mencari .env di folder induk (backend/)
# Karena file ini ada di backend/routers/ai.py
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path)

router = APIRouter(prefix="/api/ai", tags=["AI Analyst"])

class ChatRequest(BaseModel):
    message: str
    context: dict = None

async def get_system_context(db: AsyncSession):
    try:
        # Schema info (hardcoded for brevity but could be dynamic)
        schema_info = """
        Database Schema:
        - campaigns: campaign_id, name, start_date, end_date, duration_days, total_budget.
        - ads: ad_id, campaign_id, ad_platform (FB, IG, etc.), ad_type (Search, Social, etc.), target_gender, target_age_group.
        - ad_events: event_id, ad_id, user_id, timestamp, event_type (Click, Purchase, Impression, etc.).
        - users: user_id, user_gender, user_age, country, interests.
        """
        
        # Dashboard context
        dashboard_info = """
        Dashboard Features:
        - Sales Trend: Chart showing Click vs Purchase over time.
        - Category Performance: Bar chart showing total budget spent per ad type.
        - Platform Distribution: Pie chart showing count of ads per platform.
        - Metric Cards: Real-time display of Total Campaigns, Total Budget, and Event counts.
        - Performance Insights: Calculating Click-Through Rate (CTR = Clicks/Impressions) and Conversion Rate (CVR = Purchases/Clicks).
        """

        campaign_count = await db.scalar(text("SELECT COUNT(*) FROM campaigns"))
        total_budget = await db.scalar(text("SELECT SUM(total_budget) FROM campaigns"))
        budget_str = f"${total_budget:,.2f}" if total_budget else "$0.00"
        
        event_res = await db.execute(text("SELECT event_type, COUNT(*) FROM ad_events GROUP BY event_type"))
        events = {row[0]: row[1] for row in event_res.all()}
        
        data_summary = f"Data Summary: {campaign_count} Kampanye, Budget {budget_str}, Metrik {events}"
        
        return f"{schema_info}\n{dashboard_info}\n{data_summary}"
    except Exception as e:
        return f"Context error: {str(e)}"

@router.post("/chat")
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    # Ambil API KEY
    api_key = os.getenv("GOOGLE_API_KEY")
    
    # Debugging: Jika API Key kosong, kita coba muat ulang lagi
    if not api_key:
        load_dotenv(dotenv_path)
        api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        return {"response": f"API Key tidak ditemukan. Pastikan ada file .env di {base_dir} dengan isi GOOGLE_API_KEY=...", "role": "ai"}

    try:
        genai.configure(api_key=api_key)
        
        # Menggunakan model permintaan Anda yang lain
        model_name = 'gemma-3-27b-it'
        model = genai.GenerativeModel(model_name)

        system_context = await get_system_context(db)
        
        prompt = f"""
        Kamu adalah "Advanced AI Ads Analyst", asisten pakar yang terintegrasi langsung dengan Dashboard Visualisasi Data Iklan ini.
        
        PENGETAHUAN SISTEM:
        {system_context}
        
        MISI ANDA:
        1. Menjawab pertanyaan user dengan akurat berdasarkan data dan struktur dataset yang tersedia.
        2. Menjelaskan insight yang bisa diambil dari dashboard (seperti tren penjualan, performa platform, atau segmentasi target).
        3. Jika user bertanya tentang cara kerja dashboard, jelaskan fitur-fitur yang ada (Sales Trend, Category Performance, dll).
        
        ATURAN RESPON:
        - DILARANG KERAS menggunakan tanda bintang ganda (**) untuk menebalkan teks.
        - Jika user hanya menyapa (hai/halo/apa kabar): Balas dengan ramah dan tawarkan bantuan secara singkat (max 1-2 kalimat).
        - Jika user bertanya tentang data/analisis: DILARANG memberikan salam pembuka atau basa-basi. LANGSUNG berikan poin-poin datanya.
        - Format: Rapi, gunakan bullet points untuk data, dan spasi yang jelas.
        
        CONTOH RESPON ANALISIS (TANPA BASA-BASI):
        User: "Analisis performa"
        AI: "Berikut data performa Anda:
        - Total Kampanye: 50
        - CVR: 5%"
        
        PERTANYAAN USER: {request.message}
        """
        
        response = model.generate_content(prompt)
        
        if response and response.candidates:
            clean_response = response.text.replace("**", "")
            
            # Programmatic cleaning for greetings/intros
            bad_intros = [
                "Halo! Saya adalah Advanced AI Ads Analyst",
                "Halo! Saya adalah analis AI",
                "Halo!",
                "Berikut adalah analisis",
                "Tentu, ini adalah analisis",
                "Terintegrasi dengan dashboard"
            ]
            for intro in bad_intros:
                if clean_response.startswith(intro):
                    clean_response = clean_response[len(intro):].lstrip(", ").lstrip(": ").lstrip()
            
            return {
                "response": clean_response,
                "role": "ai"
            }
        
        return {"response": "AI tidak memberikan respon. Coba model lain atau cek kuota API.", "role": "ai"}

    except Exception as e:
        return {
            "response": f"Gagal memanggil {model_name}: {str(e)}",
            "role": "ai"
        }
