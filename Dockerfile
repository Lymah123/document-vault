# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY backend/package*.json .

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY backend ./backend

# Set the working directory to the backend folder where server.js is located
WORKDIR /app/backend

# Expose the port the app will run on
EXPOSE 5000

# Run the application
CMD ["npm", "start"]
