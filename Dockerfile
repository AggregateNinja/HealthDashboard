# Stage 1: Build Angular app
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the Angular source
COPY . .

# Build Angular for production
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built Angular files to Nginx's html folder
COPY --from=build /app/dist/* /usr/share/nginx/html/

# Copy custom Nginx config (optional, for Angular routes)
# If you want Angular routing to work with deep links, include this:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
