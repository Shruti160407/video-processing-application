# Video Upload, Sensitivity Processing, and Streaming Application

## Overview
This project is a full-stack web application that allows users to upload videos, analyze them for content sensitivity, track real-time processing progress, and securely stream videos after processing.

The application is designed with a scalable architecture, supports multiple users with role-based access control, and provides real-time updates using WebSockets.

---

## Tech Stack

### Backend
- Node.js (LTS)
- Express.js
- MongoDB with Mongoose ODM
- Socket.io (Real-time updates)
- JWT Authentication
- Multer (Video uploads)
- FFmpeg (Video processing)

### Frontend
- React (Vite)
- Context API for state management
- Tailwind CSS
- Axios
- Socket.io Client

---

## Features
- Secure user authentication and authorization
- Video upload with file validation
- Real-time video processing progress updates
- Automated video sensitivity classification (Safe / Flagged)
- Secure video streaming using HTTP range requests
- Multi-tenant user data isolation
- Role-based access control (Viewer, Editor, Admin)
- Responsive and user-friendly UI

---

## User Roles & Permissions

| Role   | Permissions |
|--------|------------|
| Viewer | View and stream assigned videos |
| Editor | Upload and manage videos |
| Admin  | Full system access including user management |

---

## Architecture Overview
- Frontend communicates with backend using REST APIs
- Socket.io is used for real-time processing updates
- MongoDB stores user data, video metadata, and processing status
- FFmpeg handles video processing and optimization
- Videos are streamed using HTTP range requests for efficient playback

---

## Installation & Setup

### Prerequisites
- Node.js (LTS)
- MongoDB (Local or Atlas)
- FFmpeg installed on system  

---

### Backend Setup
```bash
cd backend
npm install
npm run dev

```
### Frontend Setup
```
cd frontend
npm install
npm run dev
