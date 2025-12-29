
import uuid
from datetime import datetime, timedelta

MOCK_APPOINTMENTS = [
    {
        "id": "1",
        "patientName": "Rajesh Kumar",
        "date": "2025-11-06",
        "time": "09:00",
        "duration": 30,
        "doctorName": "Dr. Sarah Johnson",
        "status": "Upcoming",
        "mode": "In-Person",
        "type": "General Checkup"
    },
    {
        "id": "2",
        "patientName": "Priya Sharma",
        "date": "2025-11-06",
        "time": "09:30",
        "duration": 30,
        "doctorName": "Dr. Michael Chen",
        "status": "Upcoming",
        "mode": "Video",
        "type": "Follow-up"
    },
    {
        "id": "3",
        "patientName": "Amit Patel",
        "date": "2025-11-06",
        "time": "10:00",
        "duration": 45,
        "doctorName": "Dr. Sarah Johnson",
        "status": "Completed",
        "mode": "In-Person",
        "type": "Check-up"
    },
    {
        "id": "4",
        "patientName": "Sneha Reddy",
        "date": "2025-11-06",
        "time": "10:30",
        "duration": 30,
        "doctorName": "Dr. David Lee",
        "status": "Upcoming",
        "mode": "In-Person",
        "type": "Consultation"
    },
    {
        "id": "5",
        "patientName": "Vikram Singh",
        "date": "2025-11-06",
        "time": "11:00",
        "duration": 30,
        "doctorName": "Dr. Emily White",
        "status": "Cancelled",
        "mode": "Video",
        "type": "Follow-up"
    },
    {
        "id": "6",
        "patientName": "Anjali Gupta",
        "date": "2025-11-07",
        "time": "14:00",
        "duration": 60,
        "doctorName": "Dr. Sarah Johnson",
        "status": "Scheduled",
        "mode": "In-Person",
        "type": "Surgery Prep"
    },
    {
        "id": "7",
        "patientName": "Rohan Das",
        "date": "2025-11-07",
        "time": "15:30",
        "duration": 30,
        "doctorName": "Dr. Michael Chen",
        "status": "Scheduled",
        "mode": "Phone",
        "type": "Quick Consult"
    },
     {
        "id": "8",
        "patientName": "Kavita Gill",
        "date": "2025-10-25",
        "time": "09:00",
        "duration": 30,
        "doctorName": "Dr. Sarah Johnson",
        "status": "Completed",
        "mode": "In-Person",
        "type": "Annual Physical"
    },
     {
        "id": "9",
        "patientName": "Arjun Mehta",
        "date": "2025-12-01",
        "time": "16:00",
        "duration": 30,
        "doctorName": "Dr. Sarah Johnson",
        "status": "Scheduled",
        "mode": "Video",
        "type": "Consultation"
    },
    {
        "id": "10",
        "patientName": "Meera Iyer",
        "date": "2025-11-06",
        "time": "12:00",
        "duration": 60,
        "doctorName": "Dr. Sarah Johnson",
        "status": "Upcoming",
        "mode": "In-Person",
        "type": "Vaccination"
    }
]

def get_appointments(filters=None):
    if filters is None:
        filters = {}
    
    date_filter = filters.get('date')
    status_filter = filters.get('status')
    doctor_filter = filters.get('doctorName')
    
    filtered_list = MOCK_APPOINTMENTS
    
    if date_filter:
        filtered_list = [apt for apt in filtered_list if apt['date'] == date_filter]
        
    if status_filter:
        filtered_list = [apt for apt in filtered_list if apt['status'] == status_filter]
        
    if doctor_filter:
         filtered_list = [apt for apt in filtered_list if apt['doctorName'] == doctor_filter]
         
    return filtered_list

def update_appointment_status(id, new_status):
    for apt in MOCK_APPOINTMENTS:
        if apt['id'] == id:
            apt['status'] = new_status
            return apt
    return None

def get_end_time(date_str, time_str, duration_minutes):
    start_dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    end_dt = start_dt + timedelta(minutes=duration_minutes)
    return start_dt, end_dt

def create_appointment(payload):
    required_fields = ['patientName', 'date', 'time', 'duration', 'doctorName', 'mode']
    for field in required_fields:
        if field not in payload:
            raise ValueError(f"Missing required field: {field}")
            
    new_date = payload['date']
    new_doctor = payload['doctorName']
    try:
        new_start, new_end = get_end_time(new_date, payload['time'], int(payload['duration']))
    except ValueError:
        raise ValueError("Invalid date or time format.")

    existing_appointments = get_appointments({'date': new_date, 'doctorName': new_doctor})
    
    for apt in existing_appointments:
        if apt['status'] == "Cancelled":
            continue
            
        existing_start, existing_end = get_end_time(apt['date'], apt['time'], apt['duration'])
        
        if new_start < existing_end and existing_start < new_end:
            raise ValueError(f"Time conflict detected for {new_doctor} at {payload['time']}")
            
    new_appt = {
        "id": str(uuid.uuid4()),
        "patientName": payload['patientName'],
        "date": payload['date'],
        "time": payload['time'],
        "duration": int(payload['duration']),
        "doctorName": payload['doctorName'],
        "status": payload.get('status', 'Scheduled'),
        "mode": payload['mode'],
        "type": payload.get('type', 'General Consultation')
    }
    
    MOCK_APPOINTMENTS.append(new_appt)
    return new_appt

def delete_appointment(id):
    global MOCK_APPOINTMENTS
    for i, apt in enumerate(MOCK_APPOINTMENTS):
        if apt['id'] == id:
            del MOCK_APPOINTMENTS[i]
            return True
    return False
