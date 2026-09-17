# Use Node.js 22 LTS slim image
FROM node:22-slim

# Set working directory inside container
WORKDIR /app


# Copy package manifests first for Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server bound to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
