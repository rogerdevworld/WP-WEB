from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    target_weight = models.FloatField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    credits = models.IntegerField(default=100)
    
    # Nuevo: Talla de taper (S, M, L)
    TUPPER_SIZES = [
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
    ]
    tupper_size = models.CharField(max_length=1, choices=TUPPER_SIZES, default='M')
    
    # Nuevo: Foto de perfil
    profile_photo = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    # Nuevo: Preferencias Bio-Hacker
    dietary_notes = models.TextField(blank=True, help_text="Alergias, alimentos no deseados, etc.")
    is_vegetarian = models.BooleanField(default=False)
    
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"

    def __str__(self):
        return f"Perfil de {self.user.username}"

class Meal(models.Model):
    CATEGORY_CHOICES = [
        ('breakfast', 'Desayuno'),
        ('snack1', 'Snack Mañana'),
        ('lunch', 'Almuerzo'),
        ('snack2', 'Snack Tarde'),
        ('dinner', 'Cena'),
        ('juices', 'Zumo Bio-Hacker'),
    ]

    id_code = models.CharField(max_length=10, unique=True, help_text="ID único para el frontend (ej: b1, l2)")
    name_es = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Macros Nutricionales
    kcal = models.IntegerField(default=0)
    protein = models.FloatField(default=0.0, help_text="Gramos de proteína")
    carbs = models.FloatField(default=0.0, help_text="Gramos de carbohidratos")
    fats = models.FloatField(default=0.0, help_text="Gramos de grasas")
    
    # Visual y Contenido
    img_path = models.CharField(max_length=500, help_text="Ruta a la imagen (ej: /meals/avena_bowl.png)")
    ingredients = models.JSONField(default=list, help_text="Lista de ingredientes principales")
    recipe = models.TextField(blank=True, help_text="Pasos de la receta")
    
    # Instrucciones Operativas
    prep_mode = models.TextField(blank=True, help_text="Modo de preparación/calentado")
    storage_info = models.TextField(blank=True, help_text="Instrucciones de conservación")
    
    # Negocio
    cost = models.DecimalField(max_digits=6, decimal_places=2, default=0.0, help_text="Coste interno")
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.0, help_text="Precio cliente")

    # ADN del Producto (Código de Barras)
    barcode = models.CharField(max_length=100, unique=True, blank=True, null=True)
    
    # Global Bio-Metrics (Aggregated)
    avg_rating = models.FloatField(default=5.0)
    avg_salt_rating = models.FloatField(default=3.0)
    avg_pepper_rating = models.FloatField(default=3.0)
    avg_sugar_rating = models.FloatField(default=3.0)
    total_reviews = models.IntegerField(default=0)
    
    # Flavor Profile
    FLAVOR_CHOICES = [('savory', 'Salado'), ('sweet', 'Dulce')]
    flavor_profile = models.CharField(max_length=10, choices=FLAVOR_CHOICES, default='savory')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Ración"
        verbose_name_plural = "Raciones (Menú)"

    def save(self, *args, **kwargs):
        if not self.barcode:
            import random
            import string
            suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            self.barcode = f"WF-{self.category.upper()}-{self.id_code.upper()}-{self.kcal}-{suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id_code} - {self.name_es}"

class MealSelection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_selections')
    date = models.DateField() 
    selections = models.JSONField(default=dict)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Selección Semanal"
        verbose_name_plural = "Selecciones Semanales"
        unique_together = ('user', 'date')

    def __str__(self):
        return f"Plan {self.date} - {self.user.username}"

class MealHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_history')
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    date = models.DateField()
    
    # Bio-Feedback Data
    rating = models.IntegerField(default=0)  # 0 means unrated
    salt_rating = models.IntegerField(default=3)
    pepper_rating = models.IntegerField(default=3)
    sugar_rating = models.IntegerField(default=3)
    comment = models.TextField(blank=True, null=True)
    
    # Visual Feedback
    meal_photo = models.ImageField(upload_to='feedback_photos/', blank=True, null=True)
    
    # Tracking & ADN (Barcode)
    barcode = models.CharField(max_length=100, unique=True, blank=True, null=True)
    
    # Incident Reporting
    is_reported = models.BooleanField(default=False)
    issue_details = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.barcode:
            import uuid
            self.barcode = f"WF-HIST-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Historial Bio-Nutricional"
        verbose_name_plural = "Historiales Bio-Nutricionales"
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.meal.name_es} ({self.date})"

class MealInventory(models.Model):
    meal = models.OneToOneField(Meal, on_delete=models.CASCADE, related_name='inventory')
    stock_quantity = models.IntegerField(default=100)
    last_restock = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Inventario de Ración"
        verbose_name_plural = "Inventarios de Raciones"

    def __str__(self):
        return f"Stock {self.meal.id_code}: {self.stock_quantity}"

class Invoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=20, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    items_count = models.IntegerField(default=1)
    status = models.CharField(max_length=20, default='paid') # paid, pending, cancelled
    items_data = models.JSONField(help_text="Copia de los platos comprados con sus códigos de barras")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            import datetime
            import random
            now = datetime.datetime.now()
            self.invoice_number = f"WF-{now.strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Factura"
        verbose_name_plural = "Facturas"
        ordering = ['-created_at']

    def __str__(self):
        return f"Factura {self.invoice_number} - {self.user.username}"

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Carrito"
        verbose_name_plural = "Carritos"

    def __str__(self):
        return f"Carrito de {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Ítem de Carrito"
        verbose_name_plural = "Ítems de Carritos"

    def __str__(self):
        return f"{self.quantity}x {self.meal.name_es} en {self.cart}"

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan_name = models.CharField(max_length=50) # Basic, Pro, Elite
    price = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Suscripción"
        verbose_name_plural = "Suscripciones"

    def __str__(self):
        return f"Plan {self.plan_name} - {self.user.username}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pendiente de Pago'),
        ('PAID', 'Pagado - En Cola'),
        ('COOKING', 'Cocinando'),
        ('READY', 'Listo para Entrega'),
        ('DELIVERED', 'Entregado'),
        ('CANCELLED', 'Cancelado'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"

    def __str__(self):
        return f"Pedido #{self.id} - {self.user.username} ({self.status})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    barcode = models.CharField(max_length=50, blank=True)

    class Meta:
        verbose_name = "Ítem de Pedido"
        verbose_name_plural = "Ítems de Pedidos"

    def save(self, *args, **kwargs):
        if not self.barcode:
            import random
            self.barcode = f"WF-ORD-{random.randint(1000000, 9999999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}x {self.meal.name_es} (Pedido #{self.order.id})"
