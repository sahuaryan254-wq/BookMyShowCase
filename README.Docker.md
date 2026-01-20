# Docker Network Setup Guide

## Quick Start (Automated)

### Linux/Mac:
```bash
chmod +x docker-network-setup.sh
./docker-network-setup.sh
```

### Windows:
```cmd
docker-network-setup.bat
```

## Manual Setup

### 1. Create Docker Network
```bash
docker network create bookmyshowcase_network
```

### 2. Start MySQL Database
```bash
docker run -d \
  --name bookmyshowcase_db \
  --network bookmyshowcase_network \
  -e MYSQL_DATABASE=bookmyshowcase \
  -e MYSQL_USER=bookmyshowcase_user \
  -e MYSQL_PASSWORD=bookmyshowcase_pass \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

### 3. Build Backend Image
```bash
docker build -t bookmyshowcase-backend ./backend
```

### 4. Start Backend Container
```bash
docker run -d \
  --name bookmyshowcase_backend \
  --network bookmyshowcase_network \
  -p 8000:8000 \
  -e DEBUG=1 \
  -e USE_MYSQL=1 \
  -e MYSQL_DATABASE=bookmyshowcase \
  -e MYSQL_USER=bookmyshowcase_user \
  -e MYSQL_PASSWORD=bookmyshowcase_pass \
  -e MYSQL_HOST=bookmyshowcase_db \
  -e MYSQL_PORT=3306 \
  -e SECRET_KEY=django-insecure-dev-key-change-in-production \
  -e ALLOWED_HOSTS=localhost,127.0.0.1,backend \
  bookmyshowcase-backend
```

### 5. Build Frontend Image
```bash
docker build -t bookmyshowcase-frontend ./frontend
```

### 6. Start Frontend Container
```bash
docker run -d \
  --name bookmyshowcase_frontend \
  --network bookmyshowcase_network \
  -p 80:80 \
  -e REACT_APP_API_URL=http://localhost:8000/api \
  bookmyshowcase-frontend
```

## Access Services

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8000/api/
- **MySQL**: localhost:3306

## Useful Commands

### View Running Containers
```bash
docker ps
```

### View Network Details
```bash
docker network inspect bookmyshowcase_network
```

### View Logs
```bash
# Backend logs
docker logs -f bookmyshowcase_backend

# Frontend logs
docker logs -f bookmyshowcase_frontend

# Database logs
docker logs -f bookmyshowcase_db
```

### Execute Commands in Containers
```bash
# Backend shell
docker exec -it bookmyshowcase_backend bash

# Run migrations
docker exec bookmyshowcase_backend python manage.py migrate

# Create superuser
docker exec -it bookmyshowcase_backend python manage.py createsuperuser

# Django shell
docker exec -it bookmyshowcase_backend python manage.py shell
```

### Database Access
```bash
# MySQL shell
docker exec -it bookmyshowcase_db mysql -u bookmyshowcase_user -p bookmyshowcase

# Backup database
docker exec bookmyshowcase_db mysqldump -u bookmyshowcase_user -p bookmyshowcase > backup.sql
```

## Stop Everything

### Automated (Linux/Mac):
```bash
chmod +x docker-stop.sh
./docker-stop.sh
```

### Automated (Windows):
```cmd
docker-stop.bat
```

### Manual:
```bash
docker stop bookmyshowcase_db bookmyshowcase_backend bookmyshowcase_frontend
docker rm bookmyshowcase_db bookmyshowcase_backend bookmyshowcase_frontend
docker network rm bookmyshowcase_network
```

## Troubleshooting

### Check Container Status
```bash
docker ps -a
```

### Check Network
```bash
docker network ls
docker network inspect bookmyshowcase_network
```

### Restart a Container
```bash
docker restart bookmyshowcase_backend
```

### Rebuild and Restart
```bash
# Stop containers
docker stop bookmyshowcase_backend bookmyshowcase_frontend

# Remove containers
docker rm bookmyshowcase_backend bookmyshowcase_frontend

# Rebuild images
docker build -t bookmyshowcase-backend ./backend
docker build -t bookmyshowcase-frontend ./frontend

# Start again using the commands from Manual Setup
```

### Clean Up Everything (Including Volumes)
```bash
docker stop bookmyshowcase_db bookmyshowcase_backend bookmyshowcase_frontend
docker rm bookmyshowcase_db bookmyshowcase_backend bookmyshowcase_frontend
docker network rm bookmyshowcase_network
docker volume rm mysql_data
```

## Network Architecture

```
┌─────────────────────────────────────────┐
│   bookmyshowcase_network (Docker)       │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │   MySQL DB   │  │   Backend    │    │
│  │  (Port 3306) │◄─┤  (Port 8000) │    │
│  └──────────────┘  └──────────────┘    │
│                          ▲              │
│                          │              │
│                   ┌──────┴──────┐      │
│                   │   Frontend  │      │
│                   │  (Port 80)  │      │
│                   └─────────────┘      │
└─────────────────────────────────────────┘
```

All containers communicate through the Docker network using container names as hostnames.
