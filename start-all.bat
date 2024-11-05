@echo off
echo Starting the database...
docker-compose up -d

echo Starting the frontend...
cd client
start cmd /k "npm run dev"

echo Starting the backend...
cd ../server
start cmd /k "bun run dev"

echo All components started.
pause