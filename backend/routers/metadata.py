from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
import models

router = APIRouter(prefix="/api/metadata", tags=["Metadata"])

@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Ad.ad_type).distinct())
    return [r[0] for r in result.all() if r[0]]
