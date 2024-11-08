@echo off
echo Starting the backend...
cd ./server
docker-compose up -d

echo Starting the frontend...
cd ../client
start cmd /k "npm run dev"

echo All components started.
pause