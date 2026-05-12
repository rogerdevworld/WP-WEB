import os
import django
import random
from datetime import date, timedelta, datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile, Meal, MealSelection, MealHistory

def seed_all():
    print("Iniciando SEED completo...")

    # 1. Crear Usuario
    email = "tester@warnfood.bcn"
    password = "password123"
    
    user, created = User.objects.get_or_create(username=email, email=email)
    if created:
        user.set_password(password)
        user.save()
        print(f"Usuario {email} creado.")
    else:
        user.set_password(password) # Asegurar password
        user.save()
        print(f"Usuario {email} actualizado.")

    profile, p_created = UserProfile.objects.get_or_create(user=user)
    profile.full_name = "Alex Bio-Hacker"
    profile.phone = "+34 600 000 000"
    profile.height = 182.5
    profile.weight = 82.0
    profile.tupper_size = 'L'
    profile.save()

    # 2. Re-Seed Meals
    Meal.objects.all().delete()
    
    meal_data = []
    
    # Generador de nombres para variedad
    bases = {
        "breakfast": ["Avena", "Tortitas", "Tostada", "Bowl", "Smoothie", "Huevos", "Omelette", "Pudding", "Waffles", "Bagel"],
        "lunch": ["Pollo", "Salmón", "Ternera", "Pavo", "Heura", "Atún", "Lomo", "Bowl", "Pasta", "Arroz"],
        "dinner": ["Crema", "Sopa", "Ensalada", "Wok", "Wrap", "Tacos", "Burger", "Lubina", "Bacalao", "Quinoa"],
        "snack": ["Frutos Secos", "Yogur", "Barrita", "Fruta", "Hummus", "Edamame", "Queso", "Bio-Energy", "Galletas", "Batido"],
        "juices": ["Green", "Red", "Orange", "Yellow", "Purple", "Bio-Detox", "Recovery", "Energy", "Focus", "Immunity"]
    }
    modifiers = ["Cyber", "Bio", "Power", "Efficiency", "Pro", "Hacked", "Supreme", "Nova", "Core", "Zen"]
    prefixes = {
        "breakfast": "br",
        "lunch": "ln",
        "dinner": "dn",
        "snack": "sk",
        "juices": "jc"
    }
    
    # Categorías y cantidades
    specs = [
        ("breakfast", 20),
        ("lunch", 20),
        ("dinner", 20),
        ("snack", 40),
        ("juices", 20)
    ]
    
    # Mapeo de imágenes existentes
    img_map = {
        "breakfast": ["avena_bowl.png", "tortitas.png", "tostada_aguacate.png"],
        "lunch": ["lomo_saltado.png", "pollo_pimenton.png", "pabellon_bowl.png"],
        "dinner": ["salmon_miso.png", "wok_heura.png", "tacos_pollo.png"],
        "snack": ["barrita_proteina.png", "frutos_secos.png", "manzana_cacahuete.png", "yogur_chia.png"],
        "juices": ["citrus_juice.png", "green_juice.png", "red_juice.png"]
    }
    
    for category, count in specs:
        cat_key = "snack" if category.startswith("snack") else category
        for i in range(1, count + 1):
            base = random.choice(bases[cat_key])
            mod = random.choice(modifiers)
            id_code = f"{prefixes[cat_key]}{i}"
            
            name_es = f"{base} {mod}-{id_code.upper()}"
            name_en = f"{mod}-{id_code.upper()} {base}"
            
            # Macros aleatorios según categoría
            if category == "breakfast":
                kcal, prot, carbs, fats = random.randint(350, 500), random.randint(20, 35), random.randint(40, 60), random.randint(10, 20)
            elif category == "lunch":
                kcal, prot, carbs, fats = random.randint(500, 700), random.randint(35, 50), random.randint(50, 80), random.randint(15, 25)
            elif category == "dinner":
                kcal, prot, carbs, fats = random.randint(400, 550), random.randint(25, 40), random.randint(30, 50), random.randint(12, 22)
            elif category == "snack":
                kcal, prot, carbs, fats = random.randint(150, 250), random.randint(5, 15), random.randint(10, 20), random.randint(5, 15)
            else: # juices
                kcal, prot, carbs, fats = random.randint(80, 160), random.randint(1, 4), random.randint(15, 35), 0.5

            Meal.objects.create(
                id_code=id_code,
                name_es=name_es,
                name_en=name_en,
                category=category,
                kcal=kcal,
                protein=prot,
                carbs=carbs,
                fats=fats,
                price=12.50,
                cost=3.20,
                img_path=f"/meals/{random.choice(img_map[cat_key])}"
            )

    print(f"Total comidas sincronizadas: {Meal.objects.count()}")

    # 3. Seeding for ALL users
    users = User.objects.all()
    meals = list(Meal.objects.all())
    today = date.today()
    
    for u in users:
        print(f"Sincronizando datos para: {u.username}")
        # Perfil si no existe
        UserProfile.objects.get_or_create(user=u)
        
        # Historial (MealHistory) - 5 pendientes (rating=0) y 5 completados
        MealHistory.objects.filter(user=u).delete()
        for i in range(1, 11):
            target_date = today - timedelta(days=i)
            rating = 0 if i <= 5 else random.randint(4, 5)
            comment = "" if rating == 0 else "Excelente calidad nutricional."
            
            MealHistory.objects.create(
                user=u,
                meal=random.choice(meals),
                date=target_date,
                rating=rating,
                comment=comment
            )

        # Selecciones Futuras (MealSelection)
        MealSelection.objects.filter(user=u).delete()
        for i in range(0, 7):
            target_date = today + timedelta(days=i)
            selection_data = {
                "breakfast": [f"br{random.randint(1, 20)}"],
                "lunch": [f"ln{random.randint(1, 20)}"],
                "dinner": [f"dn{random.randint(1, 20)}"],
                "snack": [f"sk{random.randint(1, 40)}", f"sk{random.randint(1, 40)}"],
                "juices": [f"jc{random.randint(1, 20)}"]
            }
            MealSelection.objects.create(
                user=u,
                date=target_date,
                selections=selection_data,
                status="confirmed" if i == 0 else "pending"
            )

    print("SUCCESS: Sistema restaurado para todos los Bio-Hackers.")

if __name__ == "__main__":
    seed_all()
