from ninja import NinjaAPI
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import UserProfile
from .schemas import RegisterIn, LoginIn, AuthResponse, ErrorResponse
from django.db import transaction

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
                weight=data.weight
            )
            return 201, {
                "message": "Usuario registrado correctamente",
                "userId": user.id,
                "email": user.email,
                "name": profile.full_name,
                "height": profile.height,
                "weight": profile.weight,
                "phone": profile.phone
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
            "phone": profile.phone if profile else ""
        }
    return 401, {"error": "Credenciales incorrectas"}

@api.get("/profile/{user_id}", response={200: AuthResponse, 404: ErrorResponse})
def get_profile(request, user_id: int):
    user = get_object_or_404(User, id=user_id)
    profile = getattr(user, 'profile', None)
    return 200, {
        "message": "Perfil recuperado",
        "userId": user.id,
        "email": user.email,
        "name": profile.full_name if profile else user.username,
        "height": profile.height if profile else None,
        "weight": profile.weight if profile else None,
        "phone": profile.phone if profile else ""
    }
