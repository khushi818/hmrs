# HRMS - Human Resource Management System

A full-stack web application for managing employee information and attendance records efficiently.

## Overview

HRMS is a comprehensive Human Resource Management System designed to streamline employee management and attendance tracking. The system provides an intuitive interface for HR departments to manage employee data.

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Async Support**: Motor (async MongoDB driver)
- **Validation**: Pydantic
- **CORS**: Enabled for cross-origin requests
- **Timezone**: pytz

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS
- **HTTP Client**: Axios
- **Form Management**: Formik
- **Form Validation**: Yup

## Project Setup

## Backend Setup (FastAPI)

### 1. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGO_URL=your_mongodb_connection_string_here
```

### 2. Install Dependencies

```bash
cd backend
uv venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install uv && uv pip install -r requirements.txt
```

### 3. Run the Backend Server

```bash
uv run uvicorn app.main:app --reload
```

**Backend runs on:** http://localhost:8000

---

## Frontend Setup (React)

### 1. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Run the Frontend Server

```bash
npm run dev
```

**Frontend runs on:** http://localhost:5173

---


