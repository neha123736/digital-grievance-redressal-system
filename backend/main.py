from fastapi import FastAPI, Depends, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uuid

import models, database
from schemas import RegisterModel, LoginModel
from auth import hash_password, verify_password, create_token, get_current_user
from ai.predictor import predict_priority
from schemas import (
    RegisterModel,
    LoginModel,
    StatusUpdate
)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

# ---------------- REGISTER ----------------
@app.post("/register")
def register(user: RegisterModel, db: Session = Depends(database.get_db)):

    exist = db.query(models.User).filter(models.User.email == user.email).first()
    if exist:
        raise HTTPException(400, "User exists")

    new_user = models.User(
        id=str(uuid.uuid4()),
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()

    return {"msg": "registered"}

# ---------------- LOGIN ----------------
@app.post("/login")
def login(user: LoginModel, db: Session = Depends(database.get_db)):

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    # user not found
    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    # password check
    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Wrong password"
        )

    token = create_token({
        "email": db_user.email,
         "role": db_user.role
    })

    return {
        "token": token,
        "role": db_user.role,
        "name": db_user.name,
        "email": db_user.email
    }
#----------------- SUBMIT COMPLAINT------------------------
from ai.predictor import predict_priority
from datetime import datetime

@app.post("/submit-complaint")
def submit_complaint(
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    address: str = Form(...),
    db: Session = Depends(database.get_db),
    user=Depends(get_current_user)
):

    ai = predict_priority(title, description)

    complaint = models.Complaint(
        id=str(uuid.uuid4()),
        title=title,
        category=category,
        description=description,
        address=address,

        department=ai.get("department", "General"),
        priority=ai.get("priority", "Low"),

        user_email=user["email"],
        status="Pending",
        created_at=datetime.utcnow()
    )

    db.add(complaint)
    db.commit()

    return {"msg": "Complaint submitted"}
# ---------------- DEPARTMENT ----------------
def get_department(cat):
    return {
        "Street Lighting": "Electric Dept",
        "Water Supply": "Water Dept",
        "Road Damage": "Municipal Corp",
        "Garbage": "Sanitation"
    }.get(cat, "General")

# ---------------- MY COMPLAINTS ----------------
@app.get("/my-complaints")
def my_complaints(
    db: Session = Depends(database.get_db),
    user=Depends(get_current_user)
):

    data = db.query(models.Complaint).filter(
        models.Complaint.user_email == user["email"]
    ).all()

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    data = sorted(
        data,
        key=lambda x: priority_order.get(x.priority, 4)
    )

    result = []

    for x in data:
        result.append({
            "id": x.id,
            "keyID": x.id[:8].upper(),

            "title": x.title,
            "category": x.category,
            "department": x.department,

            "status": x.status,
            "priority": x.priority,

            "address": x.address,

            "date": x.created_at.isoformat()
            if x.created_at else None
        })

    stats = {
        "total": len(result),
        "pending": len([x for x in result if x["status"] == "Pending"]),
        "in_progress": len([x for x in result if x["status"] == "In Progress"]),
        "resolved": len([x for x in result if x["status"] == "Resolved"])
    }

    return {
        "stats": stats,
        "data": result
    }

#-----------------Track MYComplaint-----------------
@app.get("/track-complaint/{ticket_id}")
def track_complaint(
    ticket_id: str,
    db: Session = Depends(database.get_db)
):

    complaint = db.query(models.Complaint).filter(
        models.Complaint.id.like(f"{ticket_id.lower()}%")
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return {
        "id": complaint.id,
        "keyID": complaint.id[:8].upper(),

        "title": complaint.title,
        "category": complaint.category,

        "department": complaint.department,

        "status": complaint.status,
        "priority": complaint.priority,

        "address": complaint.address
    }
# ---------------- ADMIN: ALL COMPLAINTS ----------------

@app.get("/admin/all-complaints")
def get_all_complaints(
    db: Session = Depends(database.get_db),
    user=Depends(get_current_user)
):

    if user["role"] != "admin":
        raise HTTPException(403, "Admin only")

    complaints = db.query(models.Complaint).all()

    result = []

    for x in complaints:

        result.append({
            "id": x.id,
            "keyID": x.id[:8].upper(),

            "title": x.title,
            "user_email": x.user_email,

            "department": x.department,
            "priority": x.priority,
            "status": x.status
        })

    return result
#----------------------Updated admin-------------
# ---------------- ADMIN: UPDATE STATUS ----------------

@app.put("/admin/update-status/{complaint_id}")
def update_status(
    complaint_id: str,
    data: StatusUpdate,
    db: Session = Depends(database.get_db),
    user=Depends(get_current_user)
):

    # admin check
    if user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin only"
        )

    # complaint find
    complaint = db.query(models.Complaint).filter(
        models.Complaint.id == complaint_id
    ).first()

    # not found
    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    # update
    complaint.status = data.status

    db.commit()

    return {
        "msg": "Status updated"
    }