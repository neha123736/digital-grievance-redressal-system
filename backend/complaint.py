from sqlalchemy import Column, Integer, String, DateTime
from database import Base
import datetime

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)
    status = Column(String, default="Pending") # ये डैशबोर्ड के लिए जरूरी है
    description = Column(String)
    user_email = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)