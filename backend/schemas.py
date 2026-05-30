from pydantic import BaseModel, EmailStr

# REGISTER
class RegisterModel(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: str = "user"


# LOGIN
class LoginModel(BaseModel):
    email: EmailStr
    password: str


# ADMIN STATUS UPDATE
class StatusUpdate(BaseModel):
    status: str