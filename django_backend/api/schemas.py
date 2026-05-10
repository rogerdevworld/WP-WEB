from ninja import Schema
from typing import Optional

class RegisterIn(Schema):
    email: str
    password: str
    name: Optional[str] = ""
    phone: Optional[str] = ""
    height: Optional[float] = None
    weight: Optional[float] = None

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

class ErrorResponse(Schema):
    error: str
