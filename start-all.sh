#!/bin/bash

# Start the database using Docker Compose
echo "Starting the database..."
docker-compose up -d

# Start the frontend
echo "Starting the frontend..."
cd client
npm run dev &

# Start the backend
echo "Starting the backend..."
cd ../server
bun run dev &

# Wait for all background processes to finish
wait