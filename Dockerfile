# Stage 1: Build the TypeScript app
# FROM node:18 AS builder

# WORKDIR /app

# # Copy package.json and package-lock.json from dist/apps/api
# COPY dist/apps/api/package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the source code and build the app
# COPY . .
# RUN npm run build --workspace=api

# Stage 2: Create the final image
FROM node:latest

WORKDIR /app

# Copy the built files from the builder stage
# COPY --from=builder /app/dist/apps/api ./dist/apps/api
COPY dist/apps/api ./dist/apps/api

# Copy the package.json and package-lock.json from dist/apps/api
COPY dist/apps/api/package*.json ./

# Install runtime dependencies
# RUN npm install --only=production
RUN npm install

# Copy the secrets from the root directory
COPY secrets/development/keys ./keys

# Set environment variables if necessary
ENV NODE_ENV=development
ENV PORT=8080
ENV KEYS_PATH=./keys
ENV DB_HOST=192.168.1.184

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "dist/apps/api/main.js"]
