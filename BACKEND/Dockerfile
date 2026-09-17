# Use Node.js 22 LTS slim image
FROM node:22-slim

# Set working directory inside container
WORKDIR /app

# Copy package manifests first for Docker layer caching
COPY package*.json ./

# Install dependencies (bcrypt builds cleanly on slim)
RUN npm install

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 3000

# Start backend server
CMD ["node", "src/index.js"]
