# Build Stage for Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM alpine:3.18
RUN apk update && apk add --no-cache nginx

# Copy built files from frontend-build stage
COPY --from=frontend-build /app/dist /var/www/html

# Copy Nginx configuration
COPY srcs/requirements/nginx/conf/nginx.conf /etc/nginx/http.d/default.conf

RUN mkdir -p /run/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
