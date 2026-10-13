# Use minimal LTS Node image
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency definitions first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start production server
CMD ["node", "server.js"]