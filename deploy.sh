#!/bin/bash

# Deploy script for AWS Linux
set -e

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm ci 

# Build the application
echo "Building Next.js app..."
npm run build

# Set runtime host/port for PM2
if [ -z "$HOSTNAME" ] && [ -n "$HOST" ]; then
  HOSTNAME="$HOST"
fi
: "${HOSTNAME:=0.0.0.0}"
: "${PORT:=3008}"
export HOSTNAME PORT

# Restart PM2 application
echo "Restarting PM2 application..."
npm run pm2:restart

# Save PM2 configuration for auto-restart on server reboot
pm2 save
pm2 startup

echo "Deployment completed successfully!"
echo "Application is running at: http://${HOSTNAME}:${PORT}"
echo "Check status with: pm2 status"
echo "View logs with: npm run pm2:logs"
