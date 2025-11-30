## 📘  Usage Instructions

### 🚀 Project Setup

This repository contains a project composed of a Frontend (HTML/CSS/JS + Vite), Backend (Node + Prisma), and a PostgreSQL database.
You can run it either in production mode (Docker) or development/debug mode.

### 🐳 Production Mode (Docker)

1. Copy the environment configuration file:
   ```bash
   cp .env.example .env
   ```

2. Start the project:
   ```bash
   ./start-project.sh
   ```

The script will automatically configure and start all services.

### 🧪 Development / Debug Mode

1. **Frontend:**
   ```bash
   cd infrastructure/frontend
   cp .env.example .env
   # Edit the .env file as needed
   npm install
   npm run dev
   ```

2. **Banco de dados:**
   ```bash
   cd infrastructure/backend
   cp .env.example .env
   # Edit the .env file as needed
   docker-compose up -d postgres
   ```

3. **Backend:**
   ```bash
   cd infrastructure/backend
   cp .env.example .env
   # Edit the .env file as needed
   npm install
   npx prisma generate
   npx prisma migrate dev
   # You may enter any name for the new migration
   npm run start:dev
   ```

## 🔌 Available Services

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PostgreSQL: localhost:9080


## 🗂️ Version History

### [0.1.0] - 30-11-2025
#### Added
- Initial documented version of the project.