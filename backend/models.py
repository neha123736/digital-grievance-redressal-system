from sqlalchemy import Column, String, DateTime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    password = Column(String)
    role = Column(String)


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, index=True)

    title = Column(String)
    category = Column(String)
    description = Column(String)
    address = Column(String)

    status = Column(String)

    priority = Column(String)      # IMPORTANT
    department = Column(String)    # IMPORTANT

    user_email = Column(String)

    created_at = Column(DateTime)