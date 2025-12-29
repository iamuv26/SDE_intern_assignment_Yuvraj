import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, subDays, isSameDay, parseISO, startOfToday, isAfter, isBefore } from 'date-fns';
import { getAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } from '../api/appointmentService';
import AppointmentCard from './AppointmentCard';
import NewAppointmentModal from './NewAppointmentModal';
import clsx from 'clsx';

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(startOfToday());
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('Today');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initial Load & Filter Logic
    useEffect(() => {
        fetchData();
    }, [currentDate, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let filters = {};
            if (activeTab === 'Today') {
                filters.date = format(currentDate, 'yyyy-MM-dd');
            }

            let allAppointments = await getAppointments({});

            let filtered = allAppointments;

            if (activeTab === 'Today') {
                filtered = allAppointments.filter(a => a.date === format(currentDate, 'yyyy-MM-dd'));
            } else if (activeTab === 'Upcoming') {
                filtered = allAppointments.filter(a => isAfter(parseISO(a.date), startOfToday()));
            } else if (activeTab === 'Past') {
                filtered = allAppointments.filter(a => isBefore(parseISO(a.date), startOfToday()));
            }

            filtered.sort((a, b) => a.time.localeCompare(b.time));

            setAppointments(filtered);
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (days) => {
        setCurrentDate(curr => addDays(curr, days));
        if (activeTab !== 'Today') setActiveTab('Today');
    };


    const handleCreate = async (data) => {
        await createAppointment(data);
        fetchData();
    };

    const handleStatusUpdate = async (id, status) => {
        await updateAppointmentStatus(id, status);
        fetchData();
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            await deleteAppointment(id);
            fetchData();
        }
    };

    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 7);

    return (
        <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-8 ml-16 md:ml-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <CalendarIcon className="text-primary" />
                        Calendar
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your schedule and appointments</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <button
                        onClick={() => setCurrentDate(startOfToday())}
                        className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Today
                    </button>
                    <div className="flex items-center gap-2 border-l border-r border-gray-200 px-2 mx-2">
                        <button onClick={() => handleDateChange(-1)} className="p-1 hover:bg-gray-100 rounded-lg">
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <button onClick={() => handleDateChange(1)} className="p-1 hover:bg-gray-100 rounded-lg">
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>
                    <span className="text-gray-900 font-semibold min-w-[140px] text-center">
                        {format(currentDate, 'EEEE, MMM d, yyyy')}
                    </span>
                </div>

                <div className="flex gap-3">
                    <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-primary hover:border-primary transition-colors shadow-sm">
                        <Search size={20} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Create
                    </button>
                </div>
            </div>



            <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                {['Today', 'Upcoming', 'Past'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">

                    {activeTab === 'Today' ? (
                        <div className="flex-1 overflow-y-auto relative no-scrollbar p-6">

                            <div className="relative">
                                {timeSlots.map(hour => (
                                    <div key={hour} className="flex items-start h-24 border-b border-gray-50 last:border-0 group">
                                        <div className="w-16 text-xs font-medium text-gray-400 -mt-2.5 bg-white pr-2">
                                            {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                                        </div>
                                        <div className="flex-1 relative group-hover:bg-gray-50/50 transition-colors" />
                                    </div>
                                ))}

                                {appointments.map(apt => {
                                    const [hours, minutes] = apt.time.split(':').map(Number);
                                    if (hours < 7 || hours > 19) return null;

                                    const topOffset = (hours - 7) * 96 + (minutes / 60) * 96;
                                    const height = (apt.duration / 60) * 96;

                                    return (
                                        <div
                                            key={apt.id}
                                            style={{ top: `${topOffset}px`, height: `${height}px`, left: '4rem', right: '1rem' }}
                                            className="absolute ml-4 z-10"
                                        >
                                            <div className={clsx(
                                                "h-full w-full rounded-lg px-4 py-2 border-l-4 text-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-center",
                                                apt.status === 'Upcoming' && "bg-blue-50 border-blue-500 text-blue-700",
                                                apt.status === 'Scheduled' && "bg-orange-50 border-orange-500 text-orange-700",
                                                apt.status === 'Completed' && "bg-green-50 border-green-500 text-green-700",
                                                apt.status === 'Cancelled' && "bg-red-50 border-red-500 text-red-700",
                                            )}>
                                                <div className="font-bold text-sm truncate">{apt.patientName}</div>
                                                <div className="flex justify-between items-center opacity-80">
                                                    <span>{apt.type}</span>
                                                    <span>with {apt.doctorName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {appointments.length === 0 && !loading && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    No appointments for today
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 overflow-y-auto max-h-[700px]">
                            {appointments.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {appointments.map(apt => (
                                        <AppointmentCard
                                            key={apt.id}
                                            appointment={apt}
                                            onStatusUpdate={handleStatusUpdate}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-gray-400">
                                    No {activeTab.toLowerCase()} appointments found.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                        <h3 className="text-white/80 font-medium mb-1">Total Appointments</h3>
                        <div className="text-4xl font-bold mb-4">{appointments.length}</div>
                        <div className="text-sm bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                            {format(currentDate, 'MMMM yyyy')}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4">Quick Timeline</h3>
                        <div className="space-y-4">
                            {appointments.slice(0, 3).map((apt, i) => (
                                <div key={i} className="flex gap-3 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-blue-50" />
                                        {i !== 2 && <div className="w-0.5 h-full bg-gray-100 my-1" />}
                                    </div>
                                    <div className="pb-2">
                                        <div className="text-xs font-semibold text-gray-500">{apt.time}</div>
                                        <div className="text-sm font-medium text-gray-800">{apt.patientName}</div>
                                    </div>
                                </div>
                            ))}
                            {appointments.length === 0 && <span className="text-gray-400 text-sm">Nothing scheduled.</span>}
                        </div>
                    </div>
                </div>
            </div>

            <NewAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
            />
        </div >
    );
};

export default CalendarView;
