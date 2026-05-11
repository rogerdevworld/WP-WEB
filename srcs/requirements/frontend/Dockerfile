FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Copy the build to a location that can be shared via volume
CMD ["cp", "-rp", "dist/.", "/var/www/html/"]
