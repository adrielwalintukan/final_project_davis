from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from database import get_db
import models

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])

@router.get("/recent")
async def get_recent_campaigns(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Mengambil daftar kampanye terbaru menggunakan query SQL mentah agar relasi kolom lebih akurat.
    """
    # Gunakan SQL mentah untuk memastikan join tepat pada kolom yang sesuai
    sql = text("""
        SELECT 
            c.campaign_id,
            c.name,
            c.start_date,
            c.total_budget,
            a.ad_type,
            a.ad_platform,
            c.end_date
        FROM campaigns c
        LEFT JOIN ads a ON c.campaign_id = a.campaign_id
        GROUP BY c.campaign_id
        ORDER BY c.start_date DESC
        LIMIT 10
    """)
    
    result = await db.execute(sql)
    rows = result.all()
    
    campaigns = []
    for r in rows:
        # Status berdasarkan tanggal akhir
        status = "active" if r.end_date >= "2025-07-01" else "completed"
        
        campaigns.append({
            "id": f"CMP-{r.campaign_id}",
            "name": r.name,
            "timestamp": r.start_date,
            "category": r.ad_type or "General",
            "spend": f"${r.total_budget:,.0f}",
            "region": r.ad_platform or "All Platforms",
            "status": status
        })
        
    return campaigns
