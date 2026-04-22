from sqlalchemy import Column, Integer, String, Float
from database import Base

class Campaign(Base):
    __tablename__ = "campaigns"
    campaign_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    duration_days = Column(Integer)
    total_budget = Column(Float)

class Ad(Base):
    __tablename__ = "ads"
    ad_id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer)
    ad_platform = Column(String)
    ad_type = Column(String)
    target_gender = Column(String)
    target_age_group = Column(String)
    target_interests = Column(String)

class AdEvent(Base):
    __tablename__ = "ad_events"
    event_id = Column(Integer, primary_key=True, index=True)
    ad_id = Column(Integer)
    user_id = Column(String)
    timestamp = Column(String)
    day_of_week = Column(String)
    time_of_day = Column(String)
    event_type = Column(String)

class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True, index=True)
    user_gender = Column(String)
    user_age = Column(Integer)
    age_group = Column(String)
    country = Column(String)
    location = Column(String)
    interests = Column(String)
