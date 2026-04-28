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
    sql = text("""
        SELECT 
            c.campaign_id, c.name, c.start_date, c.total_budget,
            a.ad_type, a.ad_platform, c.end_date
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


@router.get("/all")
async def get_all_campaigns(
    search: Optional[str] = None,
    sort_by: str = "start_date",
    sort_dir: str = "desc",
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Semua kampanye dengan metrik lengkap — untuk halaman Archives & Campaign Insights."""
    order = "DESC" if sort_dir == "desc" else "ASC"
    valid_sort = {
        "start_date": "c.start_date",
        "budget": "c.total_budget",
        "name": "c.name",
        "duration": "c.duration_days",
        "ctr": "ctr",
        "cvr": "cvr",
    }
    sort_col = valid_sort.get(sort_by, "c.start_date")

    sql_str = """
        SELECT 
            c.campaign_id, c.name, c.start_date, c.end_date,
            c.duration_days, c.total_budget,
            MAX(a.ad_platform) as platform,
            MAX(a.ad_type) as ad_type,
            COUNT(DISTINCT a.ad_id) as total_ads,
            COUNT(CASE WHEN e.event_type = 'Impression' THEN 1 END) as impressions,
            COUNT(CASE WHEN e.event_type = 'Click' THEN 1 END) as clicks,
            COUNT(CASE WHEN e.event_type = 'Purchase' THEN 1 END) as purchases,
            COUNT(DISTINCT e.user_id) as unique_users,
            ROUND(
                CAST(COUNT(CASE WHEN e.event_type = 'Click' THEN 1 END) AS FLOAT) /
                NULLIF(COUNT(CASE WHEN e.event_type = 'Impression' THEN 1 END), 0) * 100, 2
            ) as ctr,
            ROUND(
                CAST(COUNT(CASE WHEN e.event_type = 'Purchase' THEN 1 END) AS FLOAT) /
                NULLIF(COUNT(CASE WHEN e.event_type = 'Click' THEN 1 END), 0) * 100, 2
            ) as cvr
        FROM campaigns c
        LEFT JOIN ads a ON c.campaign_id = a.campaign_id
        LEFT JOIN ad_events e ON a.ad_id = e.ad_id
        WHERE 1=1
    """
    params = {}
    if search:
        sql_str += " AND LOWER(c.name) LIKE :search"
        params["search"] = f"%{search.lower()}%"

    sql_str += f" GROUP BY c.campaign_id ORDER BY {sort_col} {order}"

    result = await db.execute(text(sql_str), params)
    rows = result.all()

    campaigns = []
    for r in rows:
        end_date = r[3] or ""
        campaign_status = "active" if end_date >= "2025-07-01" else "completed"

        if status_filter and status_filter != campaign_status:
            continue

        campaigns.append({
            "id": r[0],
            "name": r[1],
            "start_date": r[2],
            "end_date": r[3],
            "duration_days": r[4],
            "total_budget": round(r[5] or 0, 2),
            "platform": r[6] or "Multi-Platform",
            "ad_type": r[7] or "General",
            "total_ads": r[8] or 0,
            "impressions": r[9] or 0,
            "clicks": r[10] or 0,
            "purchases": r[11] or 0,
            "unique_users": r[12] or 0,
            "ctr": r[13] or 0,
            "cvr": r[14] or 0,
            "status": campaign_status,
        })

    return campaigns


@router.get("/{campaign_id}/detail")
async def get_campaign_detail(campaign_id: int, db: AsyncSession = Depends(get_db)):
    """Detail lengkap satu kampanye: event breakdown + platform breakdown."""
    # Info kampanye
    c_res = await db.execute(
        text("SELECT campaign_id, name, start_date, end_date, duration_days, total_budget FROM campaigns WHERE campaign_id = :id"),
        {"id": campaign_id}
    )
    c = c_res.one_or_none()
    if not c:
        return {"error": "Kampanye tidak ditemukan"}

    # Event breakdown
    e_res = await db.execute(text("""
        SELECT e.event_type, COUNT(*) as total, COUNT(DISTINCT e.user_id) as unique_users
        FROM ad_events e
        JOIN ads a ON e.ad_id = a.ad_id
        WHERE a.campaign_id = :id
        GROUP BY e.event_type
    """), {"id": campaign_id})
    events = {row[0]: {"count": row[1], "unique_users": row[2]} for row in e_res.all()}

    # Platform & tipe iklan breakdown
    p_res = await db.execute(text("""
        SELECT a.ad_platform, a.ad_type, COUNT(DISTINCT a.ad_id) as total_ads,
               COUNT(CASE WHEN e.event_type = 'Click' THEN 1 END) as clicks,
               COUNT(CASE WHEN e.event_type = 'Purchase' THEN 1 END) as purchases
        FROM ads a
        LEFT JOIN ad_events e ON a.ad_id = e.ad_id
        WHERE a.campaign_id = :id
        GROUP BY a.ad_platform, a.ad_type
    """), {"id": campaign_id})
    platforms = [
        {"platform": r[0], "type": r[1], "total_ads": r[2], "clicks": r[3], "purchases": r[4]}
        for r in p_res.all()
    ]

    impressions = events.get("Impression", {}).get("count", 0)
    clicks      = events.get("Click",      {}).get("count", 0)
    purchases   = events.get("Purchase",   {}).get("count", 0)

    return {
        "campaign": {
            "id": c[0], "name": c[1], "start_date": c[2], "end_date": c[3],
            "duration_days": c[4], "total_budget": round(c[5] or 0, 2),
            "status": "active" if (c[3] or "") >= "2025-07-01" else "completed",
        },
        "events": events,
        "platforms": platforms,
        "metrics": {
            "impressions": impressions,
            "clicks": clicks,
            "purchases": purchases,
            "ctr": round(clicks / impressions * 100, 2) if impressions > 0 else 0,
            "cvr": round(purchases / clicks * 100, 2) if clicks > 0 else 0,
        }
    }
