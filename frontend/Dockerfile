# --- Stage 1: Build the app ---
# --- Stage 2: Serve with Nginx ---
# Stage 1: Build the Vite app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .
#COPY .env ./ 
# Build the app
ARG FRONTEND_VITE_REACT_APP_API_BASE_URL
ENV VITE_REACT_APP_API_BASE_URL=$FRONTEND_VITE_REACT_APP_API_BASE_URL
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from first stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
