# Stage 1: Build Stage
FROM node:18-alpine as build-stage

# Set the working directory in the container
WORKDIR /usr/src/app

# Install git
RUN apk add --no-cache git

# Clone the repository
RUN git clone https://github.com/Gaurav-45/paathshala.git .

# Navigate to the frontend folder
WORKDIR /usr/src/app/frontend

# Install dependencies
RUN npm install

# Build the React app
RUN npm run build


# Stage 2: Production Stage
FROM nginx:1.23-alpine as production-stage

# Set working directory in the container
WORKDIR /usr/share/nginx/html

# Copy build artifacts from the build stage to the Nginx HTML folder
COPY --from=build-stage /usr/src/app/frontend/build .

# Copy custom nginx configuration to hanle react-routers
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Expose the default Nginx port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
