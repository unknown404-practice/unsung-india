import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.auth.models import UserRole


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.CONTRIBUTOR
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
