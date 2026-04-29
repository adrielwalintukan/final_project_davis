import os
import re
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
    model: str = "gemma-3-27b-it"
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
        - Command Deck: Main dashboard with metric cards, pie charts for platforms, bar charts for categories, and sales trends.
        - Campaign Insights: A page to view details, metrics (CTR, CVR), and platform breakdowns per specific campaign.
        - Archives: A complete, searchable, and sortable table of all historical campaigns.
        """

        campaign_count = await db.scalar(text("SELECT COUNT(*) FROM campaigns")) or 0
        total_budget = await db.scalar(text("SELECT SUM(total_budget) FROM campaigns")) or 0
        budget_str = f"${total_budget:,.2f}"
        
        event_res = await db.execute(text("SELECT event_type, COUNT(*) FROM ad_events GROUP BY event_type"))
        events_list = event_res.all()
        events = {row[0]: row[1] for row in events_list} if events_list else {}
        
        data_summary = f"Data Summary: {campaign_count} Kampanye, Budget {budget_str}, Metrik {events}"
        
        return f"{schema_info}\n{dashboard_info}\n{data_summary}"
    except Exception as e:
        print(f"Context error: {str(e)}")
        return "Context error: Gagal mengambil data terbaru dari database."

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
        
        # Fallback jika model tidak dikenal atau terjadi error konfigurasi
        current_model_name = request.model if request.model else "gemini-1.5-flash"
        
        # Tambahkan prefix 'models/' jika belum ada
        if not current_model_name.startswith("models/"):
            # Beberapa model lama mungkin tidak butuh, tapi untuk Gemma/Gemini terbaru biasanya lebih aman pakai prefix
            # Kita cek dulu apakah ini model gemma atau gemini yang umum
            if any(x in current_model_name for x in ["gemini", "gemma", "learnlm"]):
                current_model_name = f"models/{current_model_name}"
        
        model = genai.GenerativeModel(current_model_name)

        system_context = await get_system_context(db)
        
        prompt = f"""
        Kamu adalah "Advanced AI Ads Analyst", asisten pakar yang terintegrasi langsung dengan Dashboard Visualisasi Data Iklan ini.
        
        PENGETAHUAN SISTEM:
        {system_context}
        
        MISI ANDA:
        1. Menjawab pertanyaan user dengan akurat berdasarkan data dan struktur dataset yang tersedia.
        2. Menjelaskan insight yang bisa diambil dari dashboard (seperti tren penjualan, performa platform, atau segmentasi target).
        3. Jika user bertanya tentang cara kerja dashboard, jelaskan fitur-fitur yang ada (Sales Trend, Category Performance, dll).
        
        ATURAN RESPON (WAJIB DIPATUHI):
        - DILARANG KERAS menggunakan simbol Markdown: **, *, ##, #, _, >, ```
        - Tulis jawaban dalam paragraf biasa yang natural dan mudah dibaca.
        - Gunakan tanda hubung (-) HANYA jika memang ada daftar item (lebih dari 2 item). Setiap item daftar WAJIB berada di baris baru yang terpisah.
        - JANGAN memaksakan penggunaan tanda (-) jika jawabannya bisa ditulis dalam kalimat biasa.
        - Jika user hanya menyapa: Balas singkat, ramah, 1-2 kalimat saja.
        - Jika user bertanya data/analisis: Langsung ke poinnya, tanpa basa-basi pembuka.
        - Pisahkan bagian yang berbeda dengan baris kosong agar mudah dibaca.

        CONTOH RESPON YANG BENAR:
        User: "Apa itu CTR?"
        AI: "CTR (Click-Through Rate) adalah persentase orang yang mengklik iklan setelah melihatnya. Dihitung dengan rumus: Klik dibagi Impresi dikali 100."

        User: "Platform mana yang paling banyak dipakai?"
        AI: "Berikut distribusi platform berdasarkan data:
        - Facebook: 1.200 iklan
        - Instagram: 980 iklan
        - Google: 750 iklan"
        
        PERTANYAAN USER: {request.message}
        """
        
        response = model.generate_content(prompt)
        
        if response and response.candidates:
            clean_response = response.text

            # === STRIP semua simbol Markdown ===
            # LANGKAH 1: Hapus heading: ## Judul -> Judul
            clean_response = re.sub(r'^#{1,6}\s*', '', clean_response, flags=re.MULTILINE)
            # LANGKAH 2: Konversi bullet * ke - LEBIH DULU (sebelum bold stripper)
            clean_response = re.sub(r'^\*\s+', '- ', clean_response, flags=re.MULTILINE)
            # LANGKAH 3: Hapus bold/italic: **teks** / *teks* (hanya yang berpasangan)
            clean_response = re.sub(r'\*\*(.*?)\*\*', r'\1', clean_response)
            clean_response = re.sub(r'\*(.*?)\*', r'\1', clean_response)
            clean_response = re.sub(r'__(.*?)__', r'\1', clean_response)
            clean_response = re.sub(r'_(.*?)_', r'\1', clean_response)
            # LANGKAH 4: Hapus backtick inline/block
            clean_response = re.sub(r'```[\s\S]*?```', '', clean_response)
            clean_response = re.sub(r'`([^`]*)`', r'\1', clean_response)
            # LANGKAH 5: Hapus blockquote
            clean_response = re.sub(r'^>\s*', '', clean_response, flags=re.MULTILINE)
            # LANGKAH 6: Catch-all — hapus * yang masih tersisa di awal baris
            clean_response = re.sub(r'^\*+\s*', '', clean_response, flags=re.MULTILINE)
            # LANGKAH 7: Rapikan baris kosong berlebih
            clean_response = re.sub(r'\n{3,}', '\n\n', clean_response).strip()
            
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
        error_msg = str(e)
        print(f"AI Chat Error: {error_msg}")
        return {
            "response": f"Gagal memanggil model {request.model}: {error_msg}",
            "role": "ai"
        }
