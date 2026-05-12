import os
import django
import random
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Subscription, Order, OrderItem, Meal
from django.contrib.auth.models import User

def seed_extra():
    user = User.objects.first()
    if not user:
        print("No users found.")
        return

    # 1. Seed Subscriptions
    Subscription.objects.filter(user=user).delete()
    plans = [
        {"name": "Basic Bio", "price": 49.99},
        {"name": "Pro Hacker", "price": 89.99},
        {"name": "Elite Performance", "price": 149.99}
    ]
    
    plan = random.choice(plans)
    Subscription.objects.create(
        user=user,
        plan_name=plan["name"],
        price=plan["price"],
        start_date=date.today() - timedelta(days=5),
        end_date=date.today() + timedelta(days=25),
        is_active=True
    )
    print(f"Subscription seeded: {plan['name']} for {user.username}")

    # 2. Seed Orders
    Order.objects.filter(user=user).delete()
    meals = list(Meal.objects.all())
    
    for i in range(2):
        status = random.choice(['PAID', 'COOKING', 'READY', 'DELIVERED'])
        order = Order.objects.create(
            user=user,
            total_amount=0,
            status=status
        )
        
        total = 0
        selected_meals = random.sample(meals, k=random.randint(1, 3))
        for m in selected_meals:
            qty = random.randint(1, 2)
            price = float(m.price)
            OrderItem.objects.create(
                order=order,
                meal=m,
                quantity=qty,
                price_at_purchase=price
            )
            total += price * qty
        
        order.total_amount = total
        order.save()
        print(f"Order #{order.id} seeded with status {status}")

if __name__ == "__main__":
    seed_extra()
