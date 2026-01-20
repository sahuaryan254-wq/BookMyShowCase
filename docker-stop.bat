@echo off
REM Stop and remove all containers

set DB_CONTAINER=bookmyshowcase_db
set BACKEND_CONTAINER=bookmyshowcase_backend
set FRONTEND_CONTAINER=bookmyshowcase_frontend
set NETWORK_NAME=bookmyshowcase_network

echo 🛑 Stopping containers...
docker stop %DB_CONTAINER% %BACKEND_CONTAINER% %FRONTEND_CONTAINER% 2>nul

echo 🗑️  Removing containers...
docker rm %DB_CONTAINER% %BACKEND_CONTAINER% %FRONTEND_CONTAINER% 2>nul

echo 📡 Removing network...
docker network rm %NETWORK_NAME% 2>nul

echo ✅ All containers and network removed!
