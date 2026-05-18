# =========================================================
# Mitharva-AI Frontend Dockerfile
# Production Ready React Frontend
# =========================================================

# =========================================================
# BUILD STAGE
# =========================================================

FROM node:18-alpine AS builder

# Working directory
WORKDIR /app

# Package files copy
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps && \
    npm install ajv@8 ajv-keywords@5 --legacy-peer-deps

# Copy source code
COPY . .

# Backend URL build argument
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Production build
RUN npm run build

# =========================================================
# PRODUCTION STAGE
# =========================================================

FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files
COPY --from=builder /app/build /usr/share/nginx/html

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s \
    CMD wget -q --spider http://localhost:80/health || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
