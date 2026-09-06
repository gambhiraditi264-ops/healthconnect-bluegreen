# ================================================================
# HealthConnect Patient Portal - Dockerfile
# CYB204 Software Security / DevSecOps
# Scenario 3 - Blue-Green Deployment
#
# Purpose:
# This Dockerfile packages the HealthConnect Express application into
# a consistent container image that can be used for both the BLUE
# and GREEN deployment environments.
# ================================================================

# Use a lightweight official Node.js image as the application base
FROM node:18-alpine

# Set /app as the working directory inside the container.
# All following commands will operate from this directory.
WORKDIR /app

# Copy the dependency file first.
# Doing this separately allows Docker to reuse its cached dependency
# layer when application code changes but requirements stay the same.
COPY app/package*.json ./

# Install the required Node.js packages
RUN npm install

# Copy the HealthConnect application into the container
COPY app/app.js .

# Document that the application listens on port 5000
EXPOSE 5000

# Set a safe default deployment environment.
# Docker/GitHub Actions will override this with BLUE or GREEN when each
# environment is started.
ENV DEPLOY_ENV=UNKNOWN

# Run the application
CMD ["node", "app.js"]
