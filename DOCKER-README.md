# VolleyFund API - Docker Deployment Guide

This guide will help you deploy the VolleyFund API using Docker and Docker Compose.

## 🐳 Quick Start with Docker

### Prerequisites
- Docker installed ([docker.com](https://docker.com))
- Docker Compose installed (included with Docker Desktop)

### Option 1: Docker Compose (Recommended)

This will start the API along with a local MongoDB instance and Mongo Express UI.

1. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** file:
   ```env
   # For local MongoDB (using docker-compose)
   MONGODB_URI=mongodb://admin:admin123@mongodb:27017/voley?authSource=admin

   # Or for MongoDB Atlas
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voley
   ```

3. **Start all services**:
   ```bash
   docker-compose up -d
   ```

4. **Check logs**:
   ```bash
   docker-compose logs -f api
   ```

5. **Access the API**:
   - API: http://localhost:3000
   - API Docs: http://localhost:3000/api-docs
   - Mongo Express: http://localhost:8081 (admin/admin123)

6. **Stop services**:
   ```bash
   docker-compose down
   ```

### Option 2: Docker Only (With MongoDB Atlas)

If you want to use MongoDB Atlas instead of local MongoDB:

1. **Build the image**:
   ```bash
   docker build -t voleyfund-api .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e MONGODB_URI="your-mongodb-atlas-uri" \
     --name voleyfund-api \
     voleyfund-api
   ```

3. **Check logs**:
   ```bash
   docker logs -f voleyfund-api
   ```

4. **Stop container**:
   ```bash
   docker stop voleyfund-api
   docker rm voleyfund-api
   ```

## 📁 Docker Configuration Files

### Dockerfile
- Multi-stage build for optimized image size
- Node.js 18 Alpine (lightweight)
- Non-root user for security
- Health checks included
- Production-ready

### .dockerignore
- Excludes unnecessary files from image
- Reduces image size
- Improves build time

### docker-compose.yml
- API service
- MongoDB service (local development)
- Mongo Express UI
- Volume persistence
- Health checks
- Network configuration

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
# Option 1: Local MongoDB (docker-compose)
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/voley?authSource=admin

# Option 2: MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voley

# Server Configuration
NODE_ENV=production
PORT=3000
```

## 🚀 Production Deployment

### Docker Hub

1. **Tag your image**:
   ```bash
   docker tag voleyfund-api yourusername/voleyfund-api:latest
   ```

2. **Push to Docker Hub**:
   ```bash
   docker login
   docker push yourusername/voleyfund-api:latest
   ```

3. **Pull and run on server**:
   ```bash
   docker pull yourusername/voleyfund-api:latest
   docker run -d -p 3000:3000 -e MONGODB_URI="your-uri" yourusername/voleyfund-api:latest
   ```

### AWS ECS / Azure Container Instances / Google Cloud Run

The Docker image is compatible with all major cloud container services.

## 🧪 Testing

### Test the API locally:
```bash
# Start services
docker-compose up -d

# Wait for services to be ready
sleep 10

# Run tests
npm run test:local
```

### Test health endpoint:
```bash
curl http://localhost:3000/health
```

### Test API endpoints:
```bash
# Get all transactions
curl http://localhost:3000/api/Transaction/list

# Create transaction
curl -X POST http://localhost:3000/api/Transaction \
  -H "Content-Type: application/json" \
  -d '{
    "transactionType": 1,
    "amount": 100.00,
    "details": "Test transaction"
  }'
```

## 📊 Docker Commands Cheat Sheet

### Build & Run
```bash
# Build image
docker build -t voleyfund-api .

# Run container
docker run -d -p 3000:3000 --name voleyfund-api voleyfund-api

# Run with environment file
docker run -d -p 3000:3000 --env-file .env --name voleyfund-api voleyfund-api
```

### Management
```bash
# View logs
docker logs -f voleyfund-api

# Stop container
docker stop voleyfund-api

# Start container
docker start voleyfund-api

# Remove container
docker rm voleyfund-api

# Remove image
docker rmi voleyfund-api
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

## 🔍 Monitoring & Debugging

### Check container health:
```bash
docker ps
docker inspect voleyfund-api
```

### View resource usage:
```bash
docker stats voleyfund-api
```

### Execute commands in container:
```bash
docker exec -it voleyfund-api sh
```

### Access MongoDB:
```bash
# Using Mongo Express UI
http://localhost:8081

# Using MongoDB CLI
docker exec -it voleyfund-mongodb mongosh -u admin -p admin123
```

## 🗄️ Data Persistence

### Using Volumes
Docker Compose automatically creates volumes for:
- MongoDB data (`mongodb_data`)
- MongoDB config (`mongodb_config`)
- Uploads directory (mounted from host)

### Backup MongoDB:
```bash
docker exec voleyfund-mongodb mongodump --out=/backup
docker cp voleyfund-mongodb:/backup ./backup
```

### Restore MongoDB:
```bash
docker cp ./backup voleyfund-mongodb:/backup
docker exec voleyfund-mongodb mongorestore /backup
```

## 🔒 Security Best Practices

1. **Change default passwords** in docker-compose.yml
2. **Use secrets** for sensitive data in production
3. **Don't expose MongoDB port** (27017) in production
4. **Use environment variables** for all configurations
5. **Keep images updated** regularly

## 🐛 Troubleshooting

### Container won't start:
```bash
# Check logs
docker logs voleyfund-api

# Check if port is already in use
netstat -an | findstr "3000"
```

### MongoDB connection issues:
```bash
# Check if MongoDB is running
docker ps | findstr mongodb

# Check MongoDB logs
docker logs voleyfund-mongodb

# Test connection
docker exec voleyfund-mongodb mongosh --eval "db.adminCommand('ping')"
```

### Build errors:
```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
docker build --no-cache -t voleyfund-api .
```

## 📈 Performance Optimization

- Image size: ~150MB (Alpine-based)
- Multi-stage build reduces final image size
- Health checks ensure container stability
- Volume mounts for persistent data
- Network isolation for security

## 🎯 Next Steps

After successful Docker deployment:
1. Configure monitoring (Prometheus, Grafana)
2. Set up CI/CD pipeline
3. Configure reverse proxy (Nginx, Traefik)
4. Enable SSL/TLS certificates
5. Implement backup strategy

---

**Happy Dockerizing! 🐳**
