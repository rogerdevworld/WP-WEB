# pyrefly: ignore [missing-import]
from rest_framework.decorators import api_view, authentication_classes, permission_classes
# pyrefly: ignore [missing-import]
from rest_framework.response import Response
# pyrefly: ignore [missing-import]
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register_view(request):
    """
    Registra un nuevo usuario y su perfil en la base de datos.
    """
    data = request.data
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', '')
    phone = data.get('phone', '')
    height = data.get('height')
    weight = data.get('weight')

    if not email or not password:
        return Response({'error': 'Email y contraseña son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({'error': 'Este correo electrónico ya está registrado'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=email, email=email, password=password)
        UserProfile.objects.create(
            user=user,
            full_name=name,
            phone=phone,
            height=float(height) if height else None,
            weight=float(weight) if weight else None
        )
        return Response({'message': 'Usuario registrado correctamente', 'userId': user.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    """
    Verifica credenciales y devuelve éxito junto con los datos del perfil.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)
    if user is not None:
        profile = getattr(user, 'profile', None)
        return Response({
            'message': 'Login exitoso',
            'userId': user.id,
            'email': user.email,
            'name': profile.full_name if profile else user.username,
            'height': profile.height if profile else None,
            'weight': profile.weight if profile else None,
            'phone': profile.phone if profile else ""
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def profile_view(request, user_id):
    """
    Obtiene los datos del perfil de un usuario específico.
    """
    try:
        user = User.objects.get(id=user_id)
        profile = getattr(user, 'profile', None)
        return Response({
            'id': user.id,
            'email': user.email,
            'name': profile.full_name if profile else user.username,
            'height': profile.height if profile else None,
            'weight': profile.weight if profile else None,
            'phone': profile.phone if profile else ""
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
