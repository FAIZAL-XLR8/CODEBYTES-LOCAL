# ==========================================
# Stage 1: Build the React Frontend
# ==========================================
FROM node:22-slim AS frontend-builder
WORKDIR /app/frontend

COPY FRONTEND/package*.json ./
RUN npm install

COPY FRONTEND/ ./
# VITE_API_URL is set to empty string so axios uses relative paths to the same host
ENV VITE_API_URL=""
RUN npm run build

# ==========================================
# Stage 2: Express Backend + Frontend Dist
# ==========================================
FROM node:22-slim
WORKDIR /app

COPY BACKEND/package*.json ./
RUN npm install --omit=dev

COPY BACKEND/ ./
# Copy React production build into Express public folder
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000

ENV PORT=3000
CMD ["node", "src/index.js"]
