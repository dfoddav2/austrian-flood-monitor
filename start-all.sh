#!/bin/bash

# Exit on error
set -e

# Start the backend
echo "Starting the backend..."
cd ./server
docker-compose up -d

# Start the frontend
echo "Starting the frontend..."
cd ../client
npm run dev &

# Wait for all background processes to finish
wait