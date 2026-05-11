from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import UserProfile, MealSelection, Meal, MealHistory, MealInventory, Invoice, Cart, CartItem, Subscription, Order, OrderItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'id')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'meal', 'quantity', 'barcode')

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan_name', 'price', 'start_date', 'end_date', 'is_active')
    list_filter = ('plan_name', 'is_active')

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'meal', 'quantity', 'added_at')

@admin.register(MealInventory)
class MealInventoryAdmin(admin.ModelAdmin):
    list_display = ('meal', 'stock_quantity', 'last_restock', 'stock_status')
    list_editable = ('stock_quantity',)
    
    def stock_status(self, obj):
        if obj.stock_quantity <= 0: return mark_safe('<b style="color: red;">AGOTADO</b>')
        if obj.stock_quantity < 20: return mark_safe('<b style="color: orange;">BAJO</b>')
        return mark_safe('<b style="color: green;">ÓPTIMO</b>')
    stock_status.short_description = 'Estado'

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'user', 'total_amount', 'items_count', 'created_at')
    readonly_fields = ('invoice_number', 'user', 'total_amount', 'items_count', 'items_data', 'created_at')
    search_fields = ('invoice_number', 'user__email')

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('display_image', 'name_es', 'meal_rating', 'category', 'kcal', 'protein', 'barcode', 'profitability')
    list_filter = ('category', 'avg_rating')
    search_fields = ('name_es', 'name_en', 'id_code', 'barcode')

    def meal_rating(self, obj):
        stars = "★" * int(obj.avg_rating) + "☆" * (5 - int(obj.avg_rating))
        return mark_safe(f'<span style="color: #FFD700; font-size: 14px;">{stars} <small style="color: #888;">({obj.avg_rating})</small></span>')
    meal_rating.short_description = 'Bio-Rating Global'
    
    fieldsets = (
        ('Identificación', {
            'fields': ('id_code', 'barcode', 'name_es', 'name_en', 'category', 'img_path')
        }),
        ('Macros Nutricionales', {
            'fields': ('kcal', 'protein', 'carbs', 'fats'),
            'description': 'Valores bio-hacker por ración estándar'
        }),
        ('Operaciones y Receta', {
            'fields': ('ingredients', 'recipe', 'prep_mode', 'storage_info')
        }),
        ('Finanzas', {
            'fields': ('cost', 'price')
        }),
    )

    def display_image(self, obj):
        if obj.img_path:
            return mark_safe(f'<img src="{obj.img_path}" width="45" height="45" style="border-radius: 6px; border: 1px solid #FFD700; object-fit: cover;" />')
        return "N/A"
    display_image.short_description = 'Plato'

    def profitability(self, obj):
        profit = obj.price - obj.cost
        color = "green" if profit > 0 else "red"
        return mark_safe(f'<b style="color: {color};">{profit}€</b>')
    profitability.short_description = 'Rentabilidad'

@admin.register(MealHistory)
class MealHistoryAdmin(admin.ModelAdmin):
    list_display = ('date', 'user_email', 'meal_name', 'rating_stars', 'salt_status', 'pepper_status', 'reported_badge')
    list_filter = ('date', 'rating', 'is_reported', 'salt_rating', 'pepper_rating')
    search_fields = ('user__email', 'meal__name_es', 'comment', 'issue_details')
    readonly_fields = ('date', 'user', 'meal', 'rating', 'salt_rating', 'pepper_rating', 'comment', 'is_reported', 'issue_details')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Usuario'

    def meal_name(self, obj):
        return obj.meal.name_es
    meal_name.short_description = 'Comida'

    def rating_stars(self, obj):
        stars = "★" * obj.rating + "☆" * (5 - obj.rating)
        color = "#FFD700" if obj.rating >= 4 else "#555"
        return mark_safe(f'<span style="color: {color}; font-size: 14px;">{stars}</span>')
    rating_stars.short_description = 'Calificación'

    def salt_status(self, obj):
        color = "red" if obj.salt_rating > 3 else "green"
        return mark_safe(f'<span style="color: {color};">Nivel {obj.salt_rating}</span>')
    salt_status.short_description = 'Sal'

    def pepper_status(self, obj):
        color = "red" if obj.pepper_rating > 3 else "green"
        return mark_safe(f'<span style="color: {color};">Nivel {obj.pepper_rating}</span>')
    pepper_status.short_description = 'Pimienta'

    def reported_badge(self, obj):
        if obj.is_reported:
            return mark_safe('<span style="background: #ff4444; color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold;">INCIDENCIA</span>')
        return mark_safe('<span style="color: #44ff44; font-size: 10px;">OK</span>')
    reported_badge.short_description = 'Estado'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'weight', 'height', 'tupper_size')
    search_fields = ('user__email', 'full_name')

@admin.register(MealSelection)
class MealSelectionAdmin(admin.ModelAdmin):
    list_display = ('date', 'user', 'status')
    list_filter = ('date', 'status')
