#!/bin/bash

# Stop and remove all containers

DB_CONTAINER="bookmyshowcase_db"
BACKEND_CONTAINER="bookmyshowcase_backend"
FRONTEND_CONTAINER="bookmyshowcase_frontend"
NETWORK_NAME="bookmyshowcase_network"

echo "🛑 Stopping containers..."
docker stop $DB_CONTAINER $BACKEND_CONTAINER $FRONTEND_CONTAINER 2>/dev/null

echo "🗑️  Removing containers..."
docker rm $DB_CONTAINER $BACKEND_CONTAINER $FRONTEND_CONTAINER 2>/dev/null

echo "📡 Removing network..."
docker network rm $NETWORK_NAME 2>/dev/null

echo "✅ All containers and network removed!"
