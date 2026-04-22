from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from database import get_db
import models

router = APIRouter(prefix="/api/charts", tags=["Charts"])

@router.get("/sales-trend")
async def get_sales_trend(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    # Jika start_date == end_date (mode harian), kita lebarkan ke awal & akhir bulan 
    # agar grafik garis tidak kosong
    if start_date and end_date and start_date == end_date:
        year_month = start_date[:7] # Ambil YYYY-MM
        query_start = f"{year_month}-01"
        query_end = f"{year_month}-31"
    else:
        query_start = start_date
        query_end = end_date

    query_str = """
        SELECT 
            date(c.start_date) as event_date,
            COUNT(CASE WHEN e.event_type = 'Click' THEN 1 END) as click_count,
            COUNT(CASE WHEN e.event_type = 'Purchase' THEN 1 END) as purchase_count
        FROM campaigns c
        LEFT JOIN ads a ON c.campaign_id = a.campaign_id
        LEFT JOIN ad_events e ON a.ad_id = e.ad_id
        WHERE 1=1
    """
    params = {}
    if query_start:
        query_str += " AND c.start_date >= :start_date"
        params["start_date"] = query_start
    if query_end:
        query_str += " AND c.start_date <= :end_date"
        params["end_date"] = query_end
    if category:
        query_str += " AND a.ad_type = :category"
        params["category"] = category
        
    query_str += " GROUP BY event_date ORDER BY event_date ASC"
    
    result = await db.execute(text(query_str), params)
    rows = result.all()
    
    click_data = []
    purchase_data = []
    for r in rows:
        if r[0]:
            click_data.append({"label": r[0], "y": r[1]})
            purchase_data.append({"label": r[0], "y": r[2]})
        
    return {"clicks": click_data, "purchases": purchase_data}

@router.get("/category-performance")
async def get_category_performance(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    # Ambil budget kampanye yang aktif atau bersinggungan dengan tanggal terpilih
    query = select(models.Ad.ad_type, func.sum(models.Campaign.total_budget)) \
            .join(models.Campaign, models.Ad.campaign_id == models.Campaign.campaign_id)
    
    if start_date and end_date:
        # Filter: Kampanye dimulai sebelum periode berakhir DAN berakhir setelah periode dimulai
        query = query.where(models.Campaign.start_date <= end_date)
        query = query.where(models.Campaign.end_date >= start_date)
        
    result = await db.execute(query.group_by(models.Ad.ad_type))
    return [{"label": r[0], "y": round(r[1], 2)} for r in result.all()]

@router.get("/platform-distribution")
async def get_platform_distribution(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Ad.ad_platform, func.count(models.Ad.ad_id)) \
            .join(models.Campaign, models.Ad.campaign_id == models.Campaign.campaign_id)
    
    if start_date and end_date:
        query = query.where(models.Campaign.start_date <= end_date)
        query = query.where(models.Campaign.end_date >= start_date)
    if category:
        query = query.where(models.Ad.ad_type == category)
        
    result = await db.execute(query.group_by(models.Ad.ad_platform))
    return [{"label": r[0], "y": r[1]} for r in result.all()]
