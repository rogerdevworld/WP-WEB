FROM python:3.12-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apk update && apk add --no-cache \
    postgresql-dev \
    gcc \
    musl-dev \
    libpq \
    netcat-openbsd

# Install dependencies
COPY django_backend/requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project files
COPY django_backend/ .

# Copy entrypoint script
COPY srcs/requirements/backend/tools/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["entrypoint.sh"]
