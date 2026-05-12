import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import UserProfile, Meal, Invoice, Cart, CartItem
from django.contrib.auth.models import User
import random
import datetime

def seed():
    user = User.objects.first()
    if not user:
        print("No users found.")
        return

    meals = list(Meal.objects.all())
    if not meals:
        print("No meals found.")
        return

    # 1. Clear existing invoices and cart for this user to have a clean test
    Invoice.objects.filter(user=user).delete()
    Cart.objects.filter(user=user).delete()

    # 2. Create some random invoices (Past orders)
    print(f"Seeding invoices for {user.username}...")
    for i in range(3):
        selected_meals = random.sample(meals, k=random.randint(1, 4))
        items_data = []
        total = 0
        for m in selected_meals:
            price = float(m.price)
            items_data.append({
                "id_code": m.id_code,
                "name_es": m.name_es,
                "price": price,
                "category": m.category,
                "barcode": f"WF-PURCH-{random.randint(100000, 999999)}"
            })
            total += price
        
        Invoice.objects.create(
            user=user,
            total_amount=total,
            items_count=len(selected_meals),
            items_data={"items": items_data},
            status='paid',
            created_at=datetime.date.today() - datetime.timedelta(days=random.randint(1, 10))
        )

    # 3. Create a cart with pending items
    print(f"Seeding cart for {user.username}...")
    cart, _ = Cart.objects.get_or_create(user=user)
    pending_meals = random.sample(meals, k=2)
    for m in pending_meals:
        CartItem.objects.create(cart=cart, meal=m, quantity=1)

    print("Seeding complete.")

if __name__ == "__main__":
    seed()
