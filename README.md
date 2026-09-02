# NexusCollab AI - Advanced Team Project Management & AI Collaboration Platform

A production-grade, AI-native SaaS platform built using the full **MERN Stack** (**MongoDB**, **Express.js**, **React.js**, **Node.js**) with **TypeScript**, **Socket.IO** for real-time collaboration, **Framer Motion** for UI/UX animations, and an isolated **RAG (Retrieval-Augmented Generation)** / **Project Memory** engine.

---

## 🚀 Key Features

1. **Full-Stack MERN Architecture**: Express.js REST API + WebSocket server, Mongoose ORM, and React 18 frontend with TypeScript.
2. **Real-Time Collaboration**: Socket.IO project-scoped rooms for live chat, presence indicators, task updates, and instant notifications.
3. **Animated Kanban Board**: Framer Motion layout transitions with multi-column status tracking (`BACKLOG`, `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`), subtasks, and priority flags.
4. **AI Project Copilot & RAG**: Context-aware project assistant synthesizing project metadata, active tasks, project memories, and vector-embedded document chunks.
5. **AI Task & Sprint Generator**: Automatic milestone and task breakdown from feature prompts with an interactive Approve/Edit/Reject workflow.
6. **Project Memory Isolation**: Persistent project-level memory store for architecture decisions, requirements, meeting summaries, and risks.
7. **Role-Based Access Control (RBAC)**: 5 permission tiers (`SUPER_ADMIN`, `ADMIN`, `PROJECT_MANAGER`, `TEAM_MEMBER`, `VIEWER`).
8. **Admin Console & Aggregation Analytics**: MongoDB aggregation pipelines computing project completion velocity, task distribution, and team workload.
9. **Command Palette**: Global `Ctrl + K` / `Cmd + K` search and navigation shortcut.
10. **Dockerized Deployment**: Multi-container setup with `docker-compose.yml` for Frontend, Backend, MongoDB, and Redis.

---

## 🛠️ Quick Start

### 1. Using Docker Compose (Recommended)
```bash
# Clone or extract repository
cd nexus-collab-platform

# Start all services (MongoDB, Backend, Frontend)
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/v1`
- MongoDB: `mongodb://localhost:27017`

---

### 2. Manual Local Setup

#### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your OPENAI_API_KEY, JWT secrets, and MongoDB URI
npm run dev
```

#### Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```
