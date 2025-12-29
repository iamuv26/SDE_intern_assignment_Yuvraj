Appointment Management System

SDE Intern Assignment

This project implements a simplified EMR Appointment Management System with a React-based frontend and a Python backend service. The focus is on clean logic, clear separation of concerns, and realistic system design choices rather than production infrastructure.

Overview

The system allows managing medical appointments with basic CRUD functionality and conflict handling. It is split into two logical parts:

Backend (Python): Implements the core appointment logic and acts as the canonical source of truth.

Frontend (React + Vite): Provides an interactive UI for visualizing and managing appointments.

The project is intentionally lightweight and avoids unnecessary frameworks to keep the logic transparent and easy to evaluate.

Project Structure
SDE_Intern_Assignment/
├── appointment_service.py      # Core backend logic (Python)
├── test_backend.py             # Unit tests for backend logic
├── frontend/                   # React application (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── appointmentService.js   # Frontend logic mirror
│   │   ├── components/
│   │   │   ├── CalendarView.jsx
│   │   │   ├── AppointmentCard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── NewAppointmentModal.jsx
│   │   └── App.jsx
│   └── vite.config.js

Backend (Python)
Design

Uses in-memory data structures to simulate persistence.

Implements appointment creation, updates, deletion, and conflict validation.

Designed to be easily portable to a real database-backed API.

File

appointment_service.py contains all backend logic.

test_backend.py validates core behavior through unit tests.

Running Backend Tests
python test_backend.py

Frontend (React + Vite)
Design

Built using React with Vite for fast development.

Styled using Tailwind CSS for a clean, modern “Medical SaaS” look.

Component-based architecture for maintainability.

Frontend–Backend Bridge

To keep the frontend fully interactive without setting up a Flask/FastAPI server, the frontend uses a mirrored logic layer (appointmentService.js) that reflects the behavior of the Python backend.

The Python service remains the canonical implementation, while the frontend mirror exists purely for demonstration and UI interaction.

Running the Frontend
cd frontend
npm install
npm run dev


Open the URL shown in the terminal (usually http://localhost:5173).

Design Decisions
Why No API Server?

The assignment focuses on logic and reasoning, not infrastructure.

Avoids boilerplate HTTP setup while keeping core logic testable and clear.

Data Consistency

In a production system, this would be enforced using:

Database transactions (ACID)

Unique constraints or exclusion constraints for time ranges

Here, conflict checks are handled directly in the service logic.

Extensibility

This structure allows easy extension to:

REST or GraphQL APIs

Persistent databases (PostgreSQL, MySQL)

Authentication and role-based access

Conceptual API Contract (GraphQL-style)

The backend logic is designed to support flexible filtering, similar to a GraphQL query:

query GetAppointments($date: String, $status: AppointmentStatus) {
  appointments(date: $date, status: $status) {
    id
    patientName
    time
    doctorName
    status
  }
}

Notes

This project prioritizes clarity, correctness, and reasoning over production completeness.

All core logic is intentionally kept readable for review purposes.