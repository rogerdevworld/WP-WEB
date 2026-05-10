from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    
    # Nuevo: Talla de taper (S, M, L)
    TUPPER_SIZES = [
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
    ]
    tupper_size = models.CharField(max_length=1, choices=TUPPER_SIZES, default='M')
    
    # Nuevo: Foto de perfil
    profile_photo = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"

class MealSelection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_selections')
    date = models.DateField() # Día específico seleccionado
    
    # Almacenamos un objeto JSON con las selecciones múltiples: 
    # { "breakfast": ["b1", "b2"], "lunch": ["l1"], "snack1": [], ... }
    selections = models.JSONField(default=dict)
    
    status = models.CharField(max_length=20, default='pending') # pending, confirmed, delivered
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"Plan {self.date} - {self.user.username}"
