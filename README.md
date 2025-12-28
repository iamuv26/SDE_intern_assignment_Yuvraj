# Appointment Management System - SDE Intern Assignment

This project implements functionality for an EMR Appointment Management System, featuring a React Frontend and a Python Backend service.

## Project Structure

```
SDE_Intern_Assignment/
├── appointment_service.py    # Backend Logic (Python)
├── test_backend.py          # Backend Unit Tests
├── frontend/                # React Application (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── appointmentService.js  # Simulated Frontend API
│   │   ├── components/
│   │   │   ├── CalendarView.jsx       # Main Calendar Logic
│   │   │   ├── AppointmentCard.jsx    # UI Component
│   │   │   ├── Sidebar.jsx            # Navigation
│   │   │   └── NewAppointmentModal.jsx # Creation Form
│   │   └── App.jsx
│   └── vite.config.js
```

## Setup Instructions

### Backend (Python)
The backend logic is contained in `appointment_service.py`. It uses in-memory dictionaries to mock a database.

1.  **Run Tests**:
    ```bash
    python test_backend.py
    ```
    This verifies the CRUD operations using the Python service directly.

### Frontend (React + Vite)
The frontend is a modern React application styled with Tailwind CSS v4.

1.  **Navigate to folder**:
    ```bash
    cd frontend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Open in Browser**:
    Usually http://localhost:5173 (or port shown in terminal).

## Design Decisions

### Data Layer
- **Consistency**: In a real system, consistency is enforced via database transactions (ACID) and unique constraints (e.g., PostgreSQL `EXCLUDE` constraints for time ranges).
- **Mocking**: The Python backend uses a global list `MOCK_APPOINTMENTS` to simulate persistence during the runtime of the script.
- **Frontend-Backend Bridge**: To satisfy the requirement of specific Python functions while building a functional React App without setting up a full Flask/FastAPI server, the frontend uses a **mirrored Logic Layer** (`appointmentService.js`). This allows the UI to function interactively for the demo, while the *canonical* logic resides in `appointment_service.py` as requested.

### Frontend Architecture
- **Missing File**: The original `EMR_Frontend_Assignment.jsx` was not found. A robust `CalendarView.jsx` was built from scratch to match the provided UI mockups.
- **Styling**: Used Tailwind CSS v4 for a premium, clean look matching the "Medical SaaS" aesthetic.
- **Components**: Modularized into Sidebar, CalendarView, and Cards for maintainability.

## API Contract (GraphQL Style)

The `get_appointments` function is designed to support flexible filtering, similar to a GraphQL Query:

```graphql
query GetAppointments($date: String, $status: AppointmentStatus) {
  appointments(date: $date, status: $status) {
    id
    patientName
    time
    doctorName
    status
  }
}
```
