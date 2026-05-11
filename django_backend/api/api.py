from ninja import NinjaAPI, File, Form
from ninja.files import UploadedFile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import UserProfile, MealSelection, Meal, MealHistory
from .schemas import RegisterIn, LoginIn, AuthResponse, ErrorResponse, MealSelectionIn, MealSelectionOut, MealOut, MealHistoryOut, FeedbackIn
from django.db import transaction
from typing import List
from datetime import datetime

api = NinjaAPI(title="Warnfood Bio-API", version="1.0.0")

@api.get("/meals/list", response=List[MealOut])
def list_meals(request):
    return Meal.objects.all()

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
                target_weight=data.target_weight,
                age=data.age,
                birth_date=data.birth_date,
                tupper_size=data.tupper_size or "M",
                dietary_notes=data.dietary_notes or "",
                is_vegetarian=data.is_vegetarian or False
            )
            return 201, {
                "message": "Usuario registrado correctamente",
                "userId": user.id,
                "email": user.email,
                "name": profile.full_name,
                "height": profile.height,
                "weight": profile.weight,
                "target_weight": profile.target_weight,
                "age": profile.age,
                "birth_date": profile.birth_date,
                "phone": profile.phone,
                "tupper_size": profile.tupper_size,
                "profile_photo": profile.profile_photo.url if profile.profile_photo else None,
                "dietary_notes": profile.dietary_notes,
                "is_vegetarian": profile.is_vegetarian,
                "credits": profile.credits
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
            "target_weight": profile.target_weight if profile else None,
            "age": profile.age if profile else None,
            "birth_date": profile.birth_date if profile else None,
            "phone": profile.phone if profile else "",
            "tupper_size": profile.tupper_size if profile else "M",
            "profile_photo": profile.profile_photo.url if profile and profile.profile_photo else None,
            "dietary_notes": profile.dietary_notes if profile else "",
            "is_vegetarian": profile.is_vegetarian if profile else False,
            "credits": profile.credits if profile else 100
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

        # ADN_TRACKING_SYSTEM: Sincronizar historial para generación de códigos de barras
        # Eliminamos historiales pendientes previos para este día (evitar duplicados si re-edita)
        MealHistory.objects.filter(user=user, date=date_obj, rating=0).delete()
        
        # Generar nuevas raciones con tracking automático
        for category, meal_codes in data.selections.items():
            if isinstance(meal_codes, list):
                for code in meal_codes:
                    meal_obj = Meal.objects.filter(id_code=code).first()
                    if meal_obj:
                        # El método .save() de MealHistory generará el barcode único
                        MealHistory.objects.create(
                            user=user,
                            meal=meal_obj,
                            date=date_obj
                        )

        return 200, "Selección guardada y protocolos de rastreo (Barcode) generados correctamente"
    except Exception as e:
        return 400, {"error": str(e)}


@api.get("/meals/history/{user_id}", response=List[MealHistoryOut])
def get_meal_history(request, user_id: int):
    user = get_object_or_404(User, id=user_id)
    return MealHistory.objects.filter(user=user).select_related('meal').order_by('-date')

@api.post("/meals/feedback", response={200: str, 400: ErrorResponse})
def submit_feedback(request, data: FeedbackIn = Form(...), meal_photo: UploadedFile = File(None)):
    history_item = get_object_or_404(MealHistory, id=data.history_id)
    history_item.rating = data.rating
    history_item.salt_rating = data.salt_rating
    history_item.pepper_rating = data.pepper_rating
    history_item.sugar_rating = data.sugar_rating
    history_item.comment = data.comment
    history_item.is_reported = data.is_reported
    history_item.issue_details = data.issue_details
    if meal_photo:
        history_item.meal_photo = meal_photo
    history_item.save()

    # Actualizar agregados del Meal global
    meal = history_item.meal
    all_reviews = MealHistory.objects.filter(meal=meal, rating__gt=0)
    count = all_reviews.count()
    
    if count > 0:
        avg_rating = sum(r.rating for r in all_reviews) / count
        avg_salt = sum(r.salt_rating for r in all_reviews) / count
        avg_pepper = sum(r.pepper_rating for r in all_reviews) / count
        avg_sugar = sum(r.sugar_rating for r in all_reviews) / count
        
        meal.avg_rating = round(avg_rating, 2)
        meal.avg_salt_rating = round(avg_salt, 2)
        meal.avg_pepper_rating = round(avg_pepper, 2)
        meal.avg_sugar_rating = round(avg_sugar, 2)
        meal.total_reviews = count
        meal.save()

    # Bio-Credits Reward Logic
    points = 100 # Base for feedback
    if meal_photo: points += 150
    if data.comment and len(data.comment) > 100: points += 175
    
    profile = history_item.user.profile
    profile.credits += points
    profile.save()

    return 200, f"Bio-Evaluación procesada. Recompensa: +{points} CR"

@api.get("/meals/pending/{user_id}", response=List[MealHistoryOut])
def get_pending_feedbacks(request, user_id: int):
    user = get_object_or_404(User, id=user_id)
    # Últimos 5 consumos no evaluados
    return MealHistory.objects.filter(user=user, rating=0).order_by('-date')[:5]

@api.get("/meals/plans/{user_id}", response=List[MealSelectionOut])
def get_meal_plans(request, user_id: int):
    user = get_object_or_404(User, id=user_id)
    return MealSelection.objects.filter(user=user).order_by('-date')


@api.get("/profile/me/{user_id}", response=AuthResponse)
def get_profile(request, user_id: int):
    user = get_object_or_404(User, id=user_id)
    profile = user.profile
    return {
        "message": "Perfil recuperado",
        "userId": user.id,
        "email": user.email,
        "name": profile.full_name,
        "height": profile.height,
        "weight": profile.weight,
        "target_weight": profile.target_weight,
        "age": profile.age,
        "birth_date": profile.birth_date,
        "phone": profile.phone,
        "tupper_size": profile.tupper_size,
        "profile_photo": profile.profile_photo.url if profile.profile_photo else None,
        "dietary_notes": profile.dietary_notes,
        "is_vegetarian": profile.is_vegetarian,
        "credits": profile.credits
    }


@api.patch("/profile/update/{user_id}", response=AuthResponse)
def update_profile(request, user_id: int, 
                   name: str = Form(None), 
                   phone: str = Form(None), 
                   height: str = Form(None), 
                   weight: str = Form(None), 
                   target_weight: str = Form(None), 
                   age: str = Form(None), 
                   birth_date: str = Form(None), 
                   tupper_size: str = Form(None), 
                   dietary_notes: str = Form(None), 
                   is_vegetarian: str = Form(None), # Recibimos como string desde FormData
                   photo: File[UploadedFile] = None):
    
    user = get_object_or_404(User, id=user_id)
    profile = user.profile
    
    if name is not None: profile.full_name = name
    if phone is not None: profile.phone = phone
    
    try:
        if height and height.strip(): profile.height = float(height)
        if weight and weight.strip(): profile.weight = float(weight)
        if target_weight and target_weight.strip(): profile.target_weight = float(target_weight)
        if age and age.strip(): profile.age = int(age)
    except: pass

    if birth_date and birth_date.strip(): 
        try:
            bd = datetime.strptime(birth_date, "%Y-%m-%d").date()
            profile.birth_date = bd
            # Auto-calc age
            today = datetime.now().date()
            profile.age = today.year - bd.year - ((today.month, today.day) < (bd.month, bd.day))
        except:
            pass
    if tupper_size is not None: profile.tupper_size = tupper_size
    if dietary_notes is not None: profile.dietary_notes = dietary_notes
    if is_vegetarian is not None: profile.is_vegetarian = (is_vegetarian.lower() == 'true')
    
    if photo:
        profile.profile_photo = photo
    
    profile.save()
    
    return {
        "message": "Perfil actualizado",
        "userId": user.id,
        "email": user.email,
        "name": profile.full_name,
        "height": profile.height,
        "weight": profile.weight,
        "target_weight": profile.target_weight,
        "age": profile.age,
        "birth_date": profile.birth_date,
        "phone": profile.phone,
        "tupper_size": profile.tupper_size,
        "profile_photo": profile.profile_photo.url if profile.profile_photo else None,
        "dietary_notes": profile.dietary_notes,
        "is_vegetarian": profile.is_vegetarian,
        "credits": profile.credits
    }

