#!/bin/sh

# Wait for postgres to be ready
echo "Waiting for postgres..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

# Apply database migrations
echo "Applying migrations..."
python manage.py migrate

# Start server
echo "Starting server..."
exec python manage.py runserver 0.0.0.0:8000
