# 🥗 FoodLive - Bio-Hacking Nutrition Platform

FoodLive es una plataforma de gestión nutricional de alto rendimiento diseñada bajo el estándar de infraestructura **Inception**. Utiliza un ecosistema de microservicios orquestados con Docker y automatizados mediante un Makefile central.

## 🛠️ Requisitos Previos

- **Docker** & **Docker Compose**
- **GNU Make** (Disponible en Linux/macOS o vía WSL en Windows)

## 🚀 Guía de Lanzamiento Rápido

Sigue estos comandos para inicializar el sistema completo:

```bash
# 1. Construir y levantar todo el ecosistema (Nginx, Django, Postgres)
make up

# 2. Inyectar las bio-semillas de datos (Usuarios, Comidas, Historial)
make seed
```

## 📜 Comandos del Makefile

| Comando | Descripción |
| :--- | :--- |
| `make up` | Levanta los contenedores en segundo plano (`-d`) |
| `make down` | Apaga los contenedores |
| `make clean` | Elimina contenedores y redes |
| `make fclean` | **Limpieza profunda**: Borra volúmenes (DB), imágenes y dependencias locales |
| `make seed` | Ejecuta migraciones y carga los datos iniciales de prueba |
| `make re` | Ejecuta un `fclean` seguido de un `up` |
| `make status` | Muestra el estado de los servicios |
| `make logs` | Visualiza los logs en tiempo real |

## 🏗️ Arquitectura (Inception Standard)

La configuración reside en el directorio `./srcs`:
- **Nginx**: Actúa como Proxy Inverso y servidor de archivos estáticos (Vite).
- **Backend**: API construida en Django Ninja con PostgreSQL.
- **PostgreSQL**: Base de datos relacional para persistencia de bio-datos.

---
**SYSTEM_STATUS**: `ACTIVE` | **LOCATION**: `BCN_ZONE_01`
