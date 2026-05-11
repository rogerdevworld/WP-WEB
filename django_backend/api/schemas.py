from ninja import Schema
from typing import Optional, List
from datetime import date

class RegisterIn(Schema):
    email: str
    password: str
    name: Optional[str] = ""
    phone: Optional[str] = ""
    height: Optional[float] = None
    weight: Optional[float] = None
    target_weight: Optional[float] = None
    age: Optional[int] = None
    birth_date: Optional[date] = None
    tupper_size: Optional[str] = "M"
    dietary_notes: Optional[str] = ""
    is_vegetarian: Optional[bool] = False

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
    target_weight: Optional[float] = None
    age: Optional[int] = None
    birth_date: Optional[date] = None
    phone: Optional[str] = ""
    tupper_size: Optional[str] = "M"
    profile_photo: Optional[str] = None
    dietary_notes: Optional[str] = ""
    is_vegetarian: Optional[bool] = False
    credits: int = 100

class MealSelectionIn(Schema):
    date: str # ISO format YYYY-MM-DD
    selections: dict # { "breakfast": ["id1"], "lunch": ["id2"], ... }

class MealSelectionOut(Schema):
    id: int
    date: date
    selections: dict
    status: str

class ErrorResponse(Schema):
    error: str

class MealOut(Schema):
    id_code: str
    name_es: str
    name_en: str
    category: str
    kcal: int
    protein: float
    carbs: float
    fats: float
    img_path: str
    ingredients: List[str]
    recipe: str
    prep_mode: str
    storage_info: str
    cost: float
    price: float
    barcode: Optional[str] = None
    avg_rating: float = 5.0
    avg_salt_rating: float = 3.0
    avg_pepper_rating: float = 3.0
    avg_sugar_rating: float = 3.0
    total_reviews: int = 0
    flavor_profile: str = "savory"

class FeedbackIn(Schema):
    history_id: int
    rating: int
    salt_rating: int
    pepper_rating: int
    sugar_rating: int
    comment: Optional[str] = None
    is_reported: bool = False
    issue_details: Optional[str] = None

class MealHistoryOut(Schema):
    id: int
    date: date
    meal: MealOut
    rating: int
    salt_rating: int
    pepper_rating: int
    sugar_rating: int
    comment: Optional[str] = None
    is_reported: bool
    issue_details: Optional[str] = None
    meal_photo: Optional[str] = None
    barcode: Optional[str] = None
