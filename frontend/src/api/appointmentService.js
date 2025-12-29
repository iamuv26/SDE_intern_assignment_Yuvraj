import { v4 as uuidv4 } from 'uuid';

// Initial Mock Data (matching Python)
const INITIAL_APPOINTMENTS = [
    {
        id: "1",
        patientName: "Rajesh Kumar",
        date: "2025-11-06",
        time: "09:00",
        duration: 30,
        doctorName: "Dr. Sarah Johnson",
        status: "Upcoming",
        mode: "In-Person",
        type: "General Checkup"
    },
    {
        id: "2",
        patientName: "Priya Sharma",
        date: "2025-11-06",
        time: "09:30",
        duration: 30,
        doctorName: "Dr. Michael Chen",
        status: "Upcoming",
        mode: "Video",
        type: "Follow-up"
    },
    {
        id: "3",
        patientName: "Amit Patel",
        date: "2025-11-06",
        time: "10:00",
        duration: 45,
        doctorName: "Dr. Sarah Johnson",
        status: "Completed",
        mode: "In-Person",
        type: "Check-up"
    },
    {
        id: "4",
        patientName: "Sneha Reddy",
        date: "2025-11-06",
        time: "10:30",
        duration: 30,
        doctorName: "Dr. David Lee",
        status: "Upcoming",
        mode: "In-Person",
        type: "Consultation"
    },
    {
        id: "5",
        patientName: "Vikram Singh",
        date: "2025-11-06",
        time: "11:00",
        duration: 30,
        doctorName: "Dr. Emily White",
        status: "Cancelled",
        mode: "Video",
        type: "Follow-up"
    },
    {
        id: "6",
        patientName: "Anjali Gupta",
        date: "2025-11-07",
        time: "14:00",
        duration: 60,
        doctorName: "Dr. Sarah Johnson",
        status: "Scheduled",
        mode: "In-Person",
        type: "Surgery Prep"
    },
    {
        id: "7",
        patientName: "Rohan Das",
        date: "2025-11-07",
        time: "15:30",
        duration: 30,
        doctorName: "Dr. Michael Chen",
        status: "Scheduled",
        mode: "Phone",
        type: "Quick Consult"
    },
];


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const loadAppointments = () => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : INITIAL_APPOINTMENTS;
};

const saveAppointments = (apts) => {
    localStorage.setItem('appointments', JSON.stringify(apts));
};


export const getAppointments = async (filters = {}) => {
    await delay(300);
    let apts = loadAppointments();

    if (filters.date) {
        apts = apts.filter(a => a.date === filters.date);
    }
    if (filters.status) {
        apts = apts.filter(a => a.status === filters.status);
    }
    if (filters.doctorName) {
        apts = apts.filter(a => a.doctorName === filters.doctorName);
    }
    if (filters.search) {
        const lowerQ = filters.search.toLowerCase();
        apts = apts.filter(a =>
            a.patientName.toLowerCase().includes(lowerQ) ||
            a.doctorName.toLowerCase().includes(lowerQ)
        );
    }

    return apts;
};

const getEndTime = (dateStr, timeStr, durationMinutes) => {
    const start = new Date(`${dateStr}T${timeStr}`);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    return { start, end };
};

export const createAppointment = async (payload) => {
    await delay(300);
    const apts = loadAppointments();

    const { start: newStart, end: newEnd } = getEndTime(payload.date, payload.time, parseInt(payload.duration));

    const doctorApts = apts.filter(a => a.doctorName === payload.doctorName && a.date === payload.date && a.status !== 'Cancelled');

    for (const existing of doctorApts) {
        const { start: exStart, end: exEnd } = getEndTime(existing.date, existing.time, existing.duration);

        if (newStart < exEnd && exStart < newEnd) {
            throw new Error(`Time conflict detected for ${payload.doctorName}`);
        }
    }

    const newApt = {
        id: uuidv4(),
        ...payload,
        duration: parseInt(payload.duration),
        status: payload.status || 'Scheduled',
        type: payload.type || 'General Consultation'
    };

    apts.push(newApt);
    saveAppointments(apts);
    return newApt;
};

export const updateAppointmentStatus = async (id, newStatus) => {
    await delay(200);
    let apts = loadAppointments();
    const index = apts.findIndex(a => a.id === id);
    if (index !== -1) {
        apts[index].status = newStatus;
        saveAppointments(apts);
        return apts[index];
    }
    return null;
};

export const deleteAppointment = async (id) => {
    await delay(200);
    let apts = loadAppointments();
    const newApts = apts.filter(a => a.id !== id);
    saveAppointments(newApts);
    return true;
};


export const getDashboardStats = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
        totalPatients: { value: '2,543', change: '+12.5%', trend: 'up' },
        appointmentsToday: { value: '87', change: '+8.2%', trend: 'up' },
        revenue: { value: '₹4.2L', change: '+23.1%', trend: 'up' },
        activeDoctors: { value: '72/80', change: '-2.4%', trend: 'down' }
    };
};

export const getActiveDoctors = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
        { name: 'Dr. Neha T', status: 'Active' },
        { name: 'Dr. Rema S', status: 'Active' },
        { name: 'Dr. Naman S', status: 'Active' },
        { name: 'Dr. Huma A', status: 'Active' },
        { name: 'Dr. Noman S', status: 'Active' },
    ];
};
