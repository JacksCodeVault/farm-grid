# Use the official Node.js 22 image as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the frontend application
RUN pnpm run build

# Expose the port the frontend server runs on
EXPOSE 5173

# Command to run the application
CMD ["pnpm", "run", "dev"]
