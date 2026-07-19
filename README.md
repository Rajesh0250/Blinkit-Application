# Blinkit-style Kubernetes Demo

This project creates a sample three-tier application with:
- Frontend UI
- Backend microservices (auth, catalog, orders) behind an API gateway
- PostgreSQL database

## Structure
- services/frontend - web UI served by Node.js
- services/api-gateway - entry point for frontend requests
- services/auth-service - login and user lookup
- services/catalog-service - product catalog
- services/orders-service - order placement
- db - SQL bootstrap for PostgreSQL
- k8s - Kubernetes manifests

## Run locally with Docker Compose
```bash
docker compose up --build
```

Open http://localhost:3000

## Deploy to Kubernetes
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

> Replace the image names in the Kubernetes manifests with your registry if you are deploying outside a local cluster.
