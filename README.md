# Deployer

# DeployMate – Frontend Deployment Platform

DeployMate is a **lightweight CI/CD solution** for deploying frontend applications globally with **Node.js**, **Redis**, and **Cloudflare R2**.  
It automates the process of pulling code from GitHub, building, and distributing it across a CDN network — with **parallel builds, caching, real-time logs, and rollback support**.

## 🚀 Features
- **Automated CI/CD Pipeline** – Trigger deployments directly from GitHub pushes.
- **Parallel Builds & Caching** – Reduce deployment time from 6 minutes to just 2 minutes.
- **Containerized Node.js Services** – Separate services for upload, deploy, and request handling.
- **Redis Pub/Sub Task Distribution** – Efficient orchestration of deployment tasks.
- **Real-Time Log Streaming** – View build and deploy logs instantly.
- **Zero-Downtime Rollback** – Instantly revert to previous stable versions.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express
- **Task Orchestration:** Redis Pub/Sub
- **Storage:** Cloudflare R2
- **Containerization:** Docker
- **CDN Distribution:** Cloudflare CDN

## 📂 Project Structure


deploy/
├── services/
│ ├── upload-service/ # Handles file uploads to Cloudflare R2
│ ├── deploy-service/ # Builds & deploys frontend apps
│ ├── request-service/ # Manages deployment requests & logs
├── config/ # Redis, Cloudflare configs
├── utils/ # Helper scripts
└── docker-compose.yml # Service orchestration



## ⚡ Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kartik1729009/deploy.git
   cd deploy-service
   npm install
   node dist/index.js
   cd upload service
   npm install
   node dist/index.js
   cd request-service
   npm install
   node dist/index.js
