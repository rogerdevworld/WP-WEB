from ninja import NinjaAPI
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import UserProfile, MealSelection
from .schemas import RegisterIn, LoginIn, AuthResponse, ErrorResponse, MealSelectionIn, MealSelectionOut
from django.db import transaction
from typing import List
from datetime import datetime

api = NinjaAPI(title="Warnfood Bio-API", version="1.0.0")

@api.post("/register", response={201: AuthResponse, 400: ErrorResponse})
def register(request, data: RegisterIn):
    if User.objects.filter(username=data.email).exists():
        return 400, {"error": "Este correo electrónico ya está registrado"}
    
    try:
        with transaction.atomic():
            user = User.objects.create_user(
                username=data.email, 
                email=data.email, 
                password=data.password
            )
            profile = UserProfile.objects.create(
                user=user,
                full_name=data.name,
                phone=data.phone,
                height=data.height,
                weight=data.weight,
                tupper_size=data.tupper_size or "M"
            )
            return 201, {
                "message": "Usuario registrado correctamente",
                "userId": user.id,
                "email": user.email,
                "name": profile.full_name,
                "height": profile.height,
                "weight": profile.weight,
                "phone": profile.phone,
                "tupper_size": profile.tupper_size,
                "profile_photo": profile.profile_photo.url if profile.profile_photo else None
            }
    except Exception as e:
        return 400, {"error": str(e)}

@api.post("/login", response={200: AuthResponse, 401: ErrorResponse})
def login(request, data: LoginIn):
    user = authenticate(username=data.email, password=data.password)
    if user is not None:
        profile = getattr(user, 'profile', None)
        return 200, {
            "message": "Login exitoso",
            "userId": user.id,
            "email": user.email,
            "name": profile.full_name if profile else user.username,
            "height": profile.height if profile else None,
            "weight": profile.weight if profile else None,
            "phone": profile.phone if profile else "",
            "tupper_size": profile.tupper_size if profile else "M",
            "profile_photo": profile.profile_photo.url if profile and profile.profile_photo else None
        }
    return 401, {"error": "Credenciales incorrectas"}

@api.post("/meals/select/{user_id}", response={200: str, 400: ErrorResponse})
def select_meal(request, user_id: int, data: MealSelectionIn):
    user = get_object_or_404(User, id=user_id)
    try:
        # Convertir string ISO a objeto date
        date_obj = datetime.strptime(data.date, "%Y-%m-%d").date()
        
        selection, created = MealSelection.objects.update_or_create(
            user=user,
            date=date_obj,
            defaults={
                "selections": data.selections,
                "status": "confirmed"
            }
        )
        return 200, "Selección guardada correctamente"
    except Exception as e:
        return 400, {"error": str(e)}

@api.get("/meals/history/{user_id}", response=List[MealSelectionOut])
def get_meal_history(request, user_id: int):
    user = get_object_or_404(User, id=user_id)
    return MealSelection.objects.filter(user=user).order_by('-date')

@api.patch("/profile/update/{user_id}", response=AuthResponse)
def update_profile(request, user_id: int, data: RegisterIn):
    user = get_object_or_404(User, id=user_id)
    profile = user.profile
    
    if data.name: profile.full_name = data.name
    if data.phone: profile.phone = data.phone
    if data.height: profile.height = data.height
    if data.weight: profile.weight = data.weight
    if data.tupper_size: profile.tupper_size = data.tupper_size
    
    profile.save()
    
    return {
        "message": "Perfil actualizado",
        "userId": user.id,
        "email": user.email,
        "name": profile.full_name,
        "height": profile.height,
        "weight": profile.weight,
        "phone": profile.phone,
        "tupper_size": profile.tupper_size,
        "profile_photo": profile.profile_photo.url if profile.profile_photo else None
    }
