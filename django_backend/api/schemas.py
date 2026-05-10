from ninja import Schema
from typing import Optional, List
from datetime import date as date_obj

class RegisterIn(Schema):
    email: str
    password: str
    name: Optional[str] = ""
    phone: Optional[str] = ""
    height: Optional[float] = None
    weight: Optional[float] = None
    tupper_size: Optional[str] = "M"

class LoginIn(Schema):
    email: str
    password: str

class AuthResponse(Schema):
    message: str
    userId: int
    email: str
    name: Optional[str] = ""
    height: Optional[float] = None
    weight: Optional[float] = None
    phone: Optional[str] = ""
    tupper_size: Optional[str] = "M"
    profile_photo: Optional[str] = None

class MealSelectionIn(Schema):
    date: str # ISO format YYYY-MM-DD
    selections: dict # { "breakfast": ["id1"], "lunch": ["id2"], ... }

class MealSelectionOut(Schema):
    id: int
    date: date_obj
    selections: dict
    status: str

class ErrorResponse(Schema):
    error: str
