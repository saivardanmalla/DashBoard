import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/User';
import { Project } from './models/Project';
import { Task } from './models/Task';
import { ProjectMemory } from './models/ProjectMemory';
import { Activity } from './models/Activity';

export async function seedDatabase() {
  // Only seed if database is empty
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('[Seed] Database already has data, skipping seed.');
    return;
  }

  console.log('[Seed] Seeding database with initial data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Users
  const users = await User.insertMany([
    { name: 'Malla Sai Vardhan', email: 'sai@example.com', passwordHash, role: 'SUPER_ADMIN', isVerified: true },
    { name: 'Sanjay Kumar', email: 'sanjay@example.com', passwordHash, role: 'PROJECT_MANAGER', isVerified: true },
    { name: 'Devendra Singh', email: 'devendra@example.com', passwordHash, role: 'TEAM_MEMBER', isVerified: true },
    { name: 'Naresh Patel', email: 'naresh@example.com', passwordHash, role: 'TEAM_MEMBER', isVerified: true },
    { name: 'Priya Sharma', email: 'priya@example.com', passwordHash, role: 'TEAM_MEMBER', isVerified: true },
    { name: 'Ankit Verma', email: 'ankit@example.com', passwordHash, role: 'VIEWER', isVerified: true },
  ]);

  const [sai, sanjay, devendra, naresh, priya, ankit] = users;

  // Create Projects
  const projects = await Project.insertMany([
    {
      title: 'SYNORA Platform',
      key: 'SYN',
      description: 'AI-powered real-time project management platform with RAG, copilot, and team intelligence.',
      status: 'ACTIVE',
      priority: 'CRITICAL',
      owner: sai._id,
      members: [
        { user: sai._id, role: 'MANAGER' },
        { user: sanjay._id, role: 'MANAGER' },
        { user: devendra._id, role: 'DEVELOPER' },
        { user: naresh._id, role: 'DEVELOPER' },
        { user: priya._id, role: 'DEVELOPER' },
      ],
      tags: ['React', 'Node.js', 'MongoDB', 'AI', 'Socket.IO'],
    },
    {
      title: 'Distributed RAG Engine',
      key: 'RAG',
      description: 'Scalable vector search and retrieval-augmented generation engine for enterprise knowledge bases.',
      status: 'ACTIVE',
      priority: 'HIGH',
      owner: sanjay._id,
      members: [
        { user: sanjay._id, role: 'MANAGER' },
        { user: devendra._id, role: 'DEVELOPER' },
        { user: naresh._id, role: 'DEVELOPER' },
      ],
      tags: ['Python', 'Vector Search', 'OpenAI', 'MongoDB Atlas'],
    },
    {
      title: 'Mobile Client App',
      key: 'MOB',
      description: 'React Native mobile companion for SYNORA with offline-first architecture and push notifications.',
      status: 'PLANNING',
      priority: 'MEDIUM',
      owner: sai._id,
      members: [
        { user: sai._id, role: 'MANAGER' },
        { user: priya._id, role: 'DEVELOPER' },
        { user: ankit._id, role: 'VIEWER' },
      ],
      tags: ['React Native', 'Mobile', 'Offline'],
    },
    {
      title: 'CI/CD Pipeline Automation',
      key: 'CICD',
      description: 'Automated deployment pipeline with GitHub Actions, Docker, and Kubernetes orchestration.',
      status: 'COMPLETED',
      priority: 'HIGH',
      owner: devendra._id,
      members: [
        { user: devendra._id, role: 'MANAGER' },
        { user: naresh._id, role: 'DEVELOPER' },
      ],
      tags: ['DevOps', 'Docker', 'Kubernetes', 'GitHub Actions'],
    },
  ]);

  const [synora, rag, mobile, cicd] = projects;

  // Create Tasks for SYNORA project
  const now = new Date();
  const dayMs = 86400000;

  const tasks = await Task.insertMany([
    // SYNORA tasks
    {
      project: synora._id, taskNumber: 101, title: 'Setup Vector Search in MongoDB',
      description: 'Configure HNSW index and OpenAI text-embedding-3-small integration for document embeddings.',
      creator: sai._id, assignees: [devendra._id], status: 'IN_PROGRESS', priority: 'HIGH',
      order: 0, subtasks: [
        { title: 'Create embedding schema', isCompleted: true },
        { title: 'Configure HNSW index', isCompleted: false },
        { title: 'Integration tests', isCompleted: false },
      ], tags: ['Backend', 'RAG'],
    },
    {
      project: synora._id, taskNumber: 102, title: 'Implement Kanban Drag-and-Drop',
      description: 'Enable smooth drag-and-drop task movement between columns with optimistic updates.',
      creator: sai._id, assignees: [priya._id], status: 'TODO', priority: 'MEDIUM',
      order: 1, subtasks: [
        { title: 'DnD library integration', isCompleted: false },
        { title: 'Optimistic UI updates', isCompleted: false },
      ], tags: ['Frontend', 'UI'],
    },
    {
      project: synora._id, taskNumber: 103, title: 'Socket.IO Room Partitioning',
      description: 'Isolate workspace broadcast events per active project ID to prevent cross-project data leakage.',
      creator: sanjay._id, assignees: [naresh._id], status: 'DONE', priority: 'CRITICAL',
      order: 2, subtasks: [
        { title: 'Room join/leave logic', isCompleted: true },
        { title: 'Auth middleware', isCompleted: true },
        { title: 'Event isolation tests', isCompleted: true },
        { title: 'Load testing', isCompleted: true },
      ], tags: ['Realtime', 'Sockets'],
    },
    {
      project: synora._id, taskNumber: 104, title: 'AI Copilot Context Injection',
      description: 'Enhance AI copilot to include project memory, recent tasks, and team context in every prompt.',
      creator: sai._id, assignees: [sai._id], status: 'IN_PROGRESS', priority: 'HIGH',
      order: 3, subtasks: [
        { title: 'Memory retrieval', isCompleted: true },
        { title: 'Task context injection', isCompleted: false },
        { title: 'Token budget management', isCompleted: false },
      ], tags: ['AI', 'Backend'],
    },
    {
      project: synora._id, taskNumber: 105, title: 'Dashboard KPI Cards',
      description: 'Create real-time KPI cards showing project stats, task completion, team capacity, and sprint velocity.',
      creator: sanjay._id, assignees: [priya._id], status: 'TODO', priority: 'HIGH',
      order: 4, subtasks: [], tags: ['Frontend', 'Dashboard'],
    },
    {
      project: synora._id, taskNumber: 106, title: 'JWT Refresh Token Rotation',
      description: 'Implement secure refresh token rotation with automatic session extension and invalidation.',
      creator: sai._id, assignees: [devendra._id], status: 'BACKLOG', priority: 'MEDIUM',
      order: 5, subtasks: [], tags: ['Security', 'Backend'],
    },
    {
      project: synora._id, taskNumber: 107, title: 'Document Upload & Chunking Pipeline',
      description: 'Build file upload endpoint with automatic text extraction, chunking, and embedding generation.',
      creator: sanjay._id, assignees: [naresh._id], status: 'TODO', priority: 'HIGH',
      order: 6, subtasks: [
        { title: 'Multer upload endpoint', isCompleted: false },
        { title: 'Text extraction (PDF/DOCX)', isCompleted: false },
        { title: 'Chunking algorithm', isCompleted: false },
        { title: 'Embedding generation', isCompleted: false },
      ], tags: ['Backend', 'RAG'],
    },
    {
      project: synora._id, taskNumber: 108, title: 'Team Workload Analytics',
      description: 'Create backend aggregation to calculate per-member task load, completion rate, and capacity.',
      creator: sanjay._id, assignees: [devendra._id], status: 'BACKLOG', priority: 'MEDIUM',
      order: 7, subtasks: [], tags: ['Analytics', 'Backend'],
    },
    {
      project: synora._id, taskNumber: 109, title: 'Real-time Chat with Channels',
      description: 'Implement project-scoped chat channels with message persistence, typing indicators, and presence.',
      creator: sai._id, assignees: [naresh._id, priya._id], status: 'REVIEW', priority: 'HIGH',
      order: 8, subtasks: [
        { title: 'Message model', isCompleted: true },
        { title: 'Channel management', isCompleted: true },
        { title: 'Socket.IO integration', isCompleted: true },
        { title: 'UI polish', isCompleted: false },
      ], tags: ['Realtime', 'Chat'],
    },
    {
      project: synora._id, taskNumber: 110, title: 'Admin System Health Dashboard',
      description: 'Show real MongoDB connection status, Socket.IO metrics, and AI token consumption.',
      creator: sai._id, assignees: [sai._id], status: 'BACKLOG', priority: 'LOW',
      order: 9, subtasks: [], tags: ['Admin', 'Monitoring'],
    },
    // RAG project tasks
    {
      project: rag._id, taskNumber: 201, title: 'Vector Index Performance Benchmarks',
      description: 'Benchmark HNSW vs IVF indexes across 1M, 10M, and 100M document scales.',
      creator: sanjay._id, assignees: [devendra._id], status: 'IN_PROGRESS', priority: 'HIGH',
      order: 0, subtasks: [], tags: ['Performance', 'Research'],
    },
    {
      project: rag._id, taskNumber: 202, title: 'Multi-Modal Embedding Support',
      description: 'Add support for image and code embeddings alongside text embeddings.',
      creator: sanjay._id, assignees: [naresh._id], status: 'TODO', priority: 'MEDIUM',
      order: 1, subtasks: [], tags: ['AI', 'Embeddings'],
    },
    // Mobile project tasks
    {
      project: mobile._id, taskNumber: 301, title: 'React Native Project Scaffolding',
      description: 'Initialize Expo project with navigation, state management, and API layer.',
      creator: sai._id, assignees: [priya._id], status: 'TODO', priority: 'MEDIUM',
      order: 0, subtasks: [], tags: ['Mobile', 'Setup'],
    },
  ]);

  // Create Project Memories for SYNORA
  await ProjectMemory.insertMany([
    {
      project: synora._id,
      category: 'DECISION',
      title: 'Database Choice: MongoDB',
      content: 'Chose MongoDB over PostgreSQL for flexible document structure, native vector search support via Atlas, and seamless integration with Node.js/Mongoose. Decision made during initial architecture review.',
      tags: ['database', 'architecture'],
    },
    {
      project: synora._id,
      category: 'ARCHITECTURE',
      title: 'Real-time Architecture',
      content: 'Using Socket.IO with project-scoped rooms (project:{id}, channel:{id}). JWT authentication on socket handshake. Events: task.created, task.updated, task.deleted, message.created, member.joined.',
      tags: ['socket.io', 'realtime', 'architecture'],
    },
    {
      project: synora._id,
      category: 'DECISION',
      title: 'AI Provider: OpenAI GPT-4o',
      content: 'Selected OpenAI GPT-4o for copilot completions and text-embedding-3-small for embeddings. Provider abstraction layer allows future swap to Anthropic or local models.',
      tags: ['ai', 'openai', 'decision'],
    },
    {
      project: synora._id,
      category: 'REQUIREMENT',
      title: 'Authentication Requirements',
      content: 'JWT-based authentication with access tokens (7d expiry). RBAC with roles: SUPER_ADMIN, ADMIN, PROJECT_MANAGER, TEAM_MEMBER, VIEWER. Project-level roles: MANAGER, DEVELOPER, CONTRIBUTOR, VIEWER.',
      tags: ['auth', 'security', 'rbac'],
    },
    {
      project: synora._id,
      category: 'RISK',
      title: 'Vector Search Scalability',
      content: 'Current in-memory vector search will not scale beyond 100K documents. Migration to MongoDB Atlas Vector Search is required for production. Target: sub-100ms retrieval at 1M documents.',
      tags: ['risk', 'scalability', 'vector-search'],
    },
  ]);

  // Create Activities
  await Activity.insertMany([
    {
      user: sai._id, project: synora._id, action: 'created project',
      resourceType: 'PROJECT', resourceId: synora._id, resourceTitle: 'SYNORA Platform',
    },
    {
      user: devendra._id, project: synora._id, action: 'started working on',
      resourceType: 'TASK', resourceId: tasks[0]._id, resourceTitle: 'Setup Vector Search in MongoDB',
    },
    {
      user: naresh._id, project: synora._id, action: 'completed',
      resourceType: 'TASK', resourceId: tasks[2]._id, resourceTitle: 'Socket.IO Room Partitioning',
    },
    {
      user: sanjay._id, project: synora._id, action: 'moved to Review',
      resourceType: 'TASK', resourceId: tasks[8]._id, resourceTitle: 'Real-time Chat with Channels',
    },
    {
      user: priya._id, project: synora._id, action: 'joined project',
      resourceType: 'MEMBER', resourceId: synora._id, resourceTitle: 'SYNORA Platform',
    },
    {
      user: sai._id, project: synora._id, action: 'asked AI copilot',
      resourceType: 'AI', resourceTitle: 'Sprint planning recommendation',
      metadata: { query: 'What should we prioritize this sprint?' },
    },
  ]);

  console.log(`[Seed] Created ${users.length} users, ${projects.length} projects, ${tasks.length} tasks, seed complete.`);
}
