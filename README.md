# Project & Task Management System with AI Assistant

A full-stack Project and Task Management application built with MERN stack and Gemini AI integration, featuring a Trello-like Kanban board with drag-and-drop functionality.

## 🚀 Features

### Project Management
- ✅ Create, read, update, and delete projects
- ✅ Project description and creation date tracking
- ✅ Project selection and switching

### Task Management (Kanban Board)
- ✅ Create, read, update, and delete tasks
- ✅ Drag-and-drop functionality between columns
- ✅ Three status columns: To Do, In Progress, Done
- ✅ Real-time task updates

### AI-Powered Assistant (Gemini AI)
- ✅ **Project Summary**: AI generates comprehensive project summaries
- ✅ **Q&A System**: Ask questions about specific tasks and get AI-powered responses
- ✅ Intelligent task analysis and recommendations

### User Experience
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Modern, beautiful UI with Tailwind CSS
- ✅ Smooth animations and transitions
- ✅ Intuitive drag-and-drop interactions

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **HTML Drag & Drop API** - For Kanban functionality
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

### AI Integration
- **Google Gemini AI** - For intelligent summaries and Q&A
- **RESTful API** - Communication with AI services

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd project-task-management

2. Backend Setup
cd backend

# Install dependencies
npm install

# Environment variables - Create .env file
cp .env.example .env

# Backend Environment Variables (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Start Backend Server
npm run dev
Backend runs on http://localhost:5000


3. Frontend Setup
cd frontend

# Install dependencies
npm install

# Environment variables - Create .env file
cp .env.example .env

# Frontend Environment Variables (.env)
VITE_API_URL=http://localhost:5000/api

# Start Frontend Development Server
npm run dev
Frontend runs on http://localhost:5173
