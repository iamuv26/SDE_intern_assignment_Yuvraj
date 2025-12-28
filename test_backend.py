
import unittest
from appointment_service import get_appointments, create_appointment, update_appointment_status, delete_appointment, MOCK_APPOINTMENTS

class TestAppointmentService(unittest.TestCase):
    
    def test_get_appointments_filter(self):
        print("\nTesting Query Filters...")
        results = get_appointments({'date': '2025-11-06'})
        self.assertTrue(len(results) >= 1)
        print(f"Found {len(results)} appointments for 2025-11-06")
        
        status_results = get_appointments({'status': 'Cancelled'})
        self.assertTrue(any(a['status'] == 'Cancelled' for a in status_results))

    def test_create_appointment_success(self):
        print("\nTesting Create Appointment (Success)...")
        payload = {
            "patientName": "Test Patient",
            "date": "2025-12-25",
            "time": "10:00",
            "duration": 30,
            "doctorName": "Dr. Sarah Johnson",
            "mode": "In-Person"
        }
        new_apt = create_appointment(payload)
        self.assertIsNotNone(new_apt['id'])
        self.assertEqual(new_apt['status'], 'Scheduled')
        print("Created:", new_apt)

    def test_create_appointment_overlap(self):
        print("\nTesting Create Appointment (Overlap Detection)...")
        # Ensure we have a base appointment
        base_payload = {
            "patientName": "Base Patient",
            "date": "2025-12-26",
            "time": "10:00",
            "duration": 60, # 10:00 - 11:00
            "doctorName": "Dr. Overlap",
            "mode": "In-Person"
        }
        create_appointment(base_payload)
        
        # Try to overlap
        conflict_payload = {
            "patientName": "Conflict Patient",
            "date": "2025-12-26",
            "time": "10:30", # Overlaps inside
            "duration": 30,
            "doctorName": "Dr. Overlap",
            "mode": "Video"
        }
        
        with self.assertRaises(ValueError) as cm:
            create_appointment(conflict_payload)
        print("Successfully caught overlap:", cm.exception)

    def test_update_status(self):
        print("\nTesting Update Status...")
        # Get an ID to update
        target = MOCK_APPOINTMENTS[0]
        new_status = "Confirmed"
        updated = update_appointment_status(target['id'], new_status)
        self.assertEqual(updated['status'], new_status)
        print(f"Updated appointment {target['id']} to {new_status}")

    def test_delete_appointment(self):
        print("\nTesting Delete...")
        # create a dummy to delete
        payload = {
            "patientName": "Delete Me",
            "date": "2025-12-30",
            "time": "10:00",
            "duration": 15,
            "doctorName": "Dr. Delete",
            "mode": "Phone"
        }
        to_delete = create_appointment(payload)
        id_to_del = to_delete['id']
        
        success = delete_appointment(id_to_del)
        self.assertTrue(success)
        
        # Verify it's gone
        found = any(a['id'] == id_to_del for a in MOCK_APPOINTMENTS)
        self.assertFalse(found)
        print(f"Deleted appointment {id_to_del}")

if __name__ == '__main__':
    unittest.main()
