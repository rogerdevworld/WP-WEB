from django.db import models
from django.contrib.auth.models import User

# Modelo UserProfile.
# Extiende la información básica del usuario de Django para incluir
# datos específicos de nuestra aplicación de nutrición.
class UserProfile(models.Model):
    # Relación uno a uno con el usuario estándar de Django
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Datos de contacto y personales
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    # Datos antropométricos (Fitness)
    height = models.FloatField(null=True, blank=True) # En centímetros
    weight = models.FloatField(null=True, blank=True) # En kilogramos
    
    # Fecha de actualización de medidas
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"
