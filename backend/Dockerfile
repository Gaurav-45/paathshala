# Get the base image
FROM node:18-alpine 

# Set the working directory in the container
WORKDIR /usr/src/app

# Install git
RUN apk add --no-cache git

# Clone the repository
RUN git clone https://github.com/Gaurav-45/paathshala .

# Navigate to the backend folder
WORKDIR /usr/src/app/backend

# Install dependencies
RUN npm install

# Expose port 5000
EXPOSE 8000

# Start the backend server
CMD ["npm", "start"]
