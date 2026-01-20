#!/bin/bash

# BookMyShowcase Docker Network Setup Script

NETWORK_NAME="bookmyshowcase_network"
DB_CONTAINER="bookmyshowcase_db"
BACKEND_CONTAINER="bookmyshowcase_backend"
FRONTEND_CONTAINER="bookmyshowcase_frontend"

echo "🚀 Setting up BookMyShowcase with Docker Network..."

# Create Docker network
echo "📡 Creating Docker network..."
docker network create $NETWORK_NAME 2>/dev/null || echo "Network already exists"

# Stop and remove existing containers
echo "🧹 Cleaning up existing containers..."
docker stop $DB_CONTAINER $BACKEND_CONTAINER $FRONTEND_CONTAINER 2>/dev/null
docker rm $DB_CONTAINER $BACKEND_CONTAINER $FRONTEND_CONTAINER 2>/dev/null

# Start MySQL Database
echo "🗄️  Starting MySQL database..."
docker run -d \
  --name $DB_CONTAINER \
  --network $NETWORK_NAME \
  -e MYSQL_DATABASE=bookmyshowcase \
  -e MYSQL_USER=bookmyshowcase_user \
  -e MYSQL_PASSWORD=bookmyshowcase_pass \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0

echo "⏳ Waiting for MySQL to be ready..."
sleep 15

# Build and start Backend
echo "🔨 Building backend image..."
docker build -t bookmyshowcase-backend ./backend

echo "🐍 Starting Django backend..."
docker run -d \
  --name $BACKEND_CONTAINER \
  --network $NETWORK_NAME \
  -p 8000:8000 \
  -e DEBUG=1 \
  -e USE_MYSQL=1 \
  -e MYSQL_DATABASE=bookmyshowcase \
  -e MYSQL_USER=bookmyshowcase_user \
  -e MYSQL_PASSWORD=bookmyshowcase_pass \
  -e MYSQL_HOST=$DB_CONTAINER \
  -e MYSQL_PORT=3306 \
  -e SECRET_KEY=django-insecure-dev-key-change-in-production \
  -e ALLOWED_HOSTS=localhost,127.0.0.1,backend \
  bookmyshowcase-backend

# Build and start Frontend
echo "🔨 Building frontend image..."
docker build -t bookmyshowcase-frontend ./frontend

echo "⚛️  Starting React frontend..."
docker run -d \
  --name $FRONTEND_CONTAINER \
  --network $NETWORK_NAME \
  -p 80:80 \
  -e REACT_APP_API_URL=http://localhost:8000/api \
  bookmyshowcase-frontend

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Services:"
echo "   - Frontend:  http://localhost:80"
echo "   - Backend:   http://localhost:8000/api/"
echo "   - MySQL:     localhost:3306"
echo ""
echo "🔍 Check status:"
echo "   docker ps"
echo ""
echo "📝 View logs:"
echo "   docker logs -f $BACKEND_CONTAINER"
echo "   docker logs -f $FRONTEND_CONTAINER"
echo ""
echo "🛑 Stop all:"
echo "   docker stop $DB_CONTAINER $BACKEND_CONTAINER $FRONTEND_CONTAINER"
echo ""
echo "🗑️  Remove all:"
echo "   docker rm $DB_CONTAINER $BACKEND_CONTAINER $FRONTEND_CONTAINER"
echo "   docker network rm $NETWORK_NAME"
