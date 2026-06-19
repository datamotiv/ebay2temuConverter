# Use an official Node.js image as the base, which includes Linux (Debian-based)
FROM node:current-bullseye

# Update the package list and install any necessary packages (optional)
RUN apt-get update && apt-get install -y \
    vim \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy your Node.js app or any files you need (optional)
# COPY . .

# Expose any port you need (optional, depending on your app)
# EXPOSE 3000

# Start a command that keeps the container running
CMD ["tail", "-f", "/dev/null"]
