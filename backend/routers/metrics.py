from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from database import get_db
import models

router = APIRouter(prefix="/api/metrics", tags=["Metrics"])

@router.get("")
async def get_metrics(
    start_date: Optional[str] = None, 
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    # 1. Metrik Kampanye: Cari kampanye yang AKTIF di rentang waktu tersebut
    campaign_sql = """
        SELECT 
            COUNT(DISTINCT c.campaign_id), 
            SUM(c.total_budget)
        FROM campaigns c
        LEFT JOIN ads a ON c.campaign_id = a.campaign_id
        WHERE 1=1
    """
    params = {}
    if start_date and end_date:
        campaign_sql += " AND c.start_date <= :end_date AND c.end_date >= :start_date"
        params["start_date"] = start_date
        params["end_date"] = end_date
    if category: 
        campaign_sql += " AND a.ad_type = :category"
        params["category"] = category

    c_res = await db.execute(text(campaign_sql), params)
    c_row = c_res.one()

    # 2. Metrik Event: Cari interaksi yang TERJADI di rentang waktu tersebut
    event_sql = """
        SELECT 
            e.event_type, 
            COUNT(e.event_id),
            COUNT(DISTINCT e.user_id)
        FROM ad_events e
        JOIN ads a ON e.ad_id = a.ad_id
        WHERE 1=1
    """
    if start_date and end_date:
        event_sql += " AND date(e.timestamp) BETWEEN :start_date AND :end_date"
    if category: 
        event_sql += " AND a.ad_type = :category"
    
    event_sql += " GROUP BY e.event_type"
    
    e_res = await db.execute(text(event_sql), params)
    rows = e_res.all()
    
    events = {r[0]: r[1] for r in rows}
    # User unik total di periode tersebut
    unique_users_sql = "SELECT COUNT(DISTINCT e.user_id) FROM ad_events e JOIN ads a ON e.ad_id = a.ad_id WHERE 1=1"
    if start_date and end_date:
        unique_users_sql += " AND date(e.timestamp) BETWEEN :start_date AND :end_date"
    if category:
        unique_users_sql += " AND a.ad_type = :category"
    
    unique_users = await db.scalar(text(unique_users_sql), params)

    impressions = events.get("Impression", 0)
    clicks = events.get("Click", 0)
    purchases = events.get("Purchase", 0)

    # Hitung CTR & CVR (Gunakan nilai default jika 0 agar tidak error)
    ctr = (clicks / impressions * 100) if impressions > 0 else 0
    cvr = (purchases / clicks * 100) if clicks > 0 else 0

    return {
        "summary": {
            "total_campaigns": c_row[0] or 0,
            "total_budget": round(c_row[1] or 0, 2),
            "unique_users_reached": unique_users or 0
        },
        "performance": {
            "ctr_percent": round(ctr, 2),
            "cvr_percent": round(cvr, 2),
            "clicks": clicks,
            "purchases": purchases
        }
    }
