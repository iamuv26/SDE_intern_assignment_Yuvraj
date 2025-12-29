import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Activity, FileText } from 'lucide-react';
import { getDashboardStats, getActiveDoctors, getAppointments } from '../api/appointmentService';
import StatCard from './StatCard';
import ActiveDoctors from './ActiveDoctors';
import AppointmentCard from './AppointmentCard';

const DashboardView = () => {
    const [stats, setStats] = useState(null);
    const [activeDoctors, setActiveDoctors] = useState([]);
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            const [statsData, docsData, apptsData] = await Promise.all([
                getDashboardStats(),
                getActiveDoctors(),
                getAppointments({ date: '2025-11-06', search: searchQuery })
            ]);
            setStats(statsData);
            setActiveDoctors(docsData);
            setTodaysAppointments(apptsData.slice(0, 4));
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    if (loading || !stats) {
        return <div className="p-8 ml-16 md:ml-20 flex justify-center text-gray-400">Loading Dashboard...</div>;
    }

    return (
        <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-8 ml-16 md:ml-20">

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, Dr. Sarah Johnson</p>
                </div>
                <div className="flex gap-2">
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search patients..."
                        className="bg-white border-none rounded-xl px-4 py-2 text-sm shadow-sm w-64 ring-1 ring-gray-100 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={Users}
                    label="Total Patients"
                    value={stats.totalPatients.value}
                    change={stats.totalPatients.change}
                    trend={stats.totalPatients.trend}
                    iconBg="bg-blue-500"
                />
                <StatCard
                    icon={Calendar}
                    label="Appointments Today"
                    value={stats.appointmentsToday.value}
                    change={stats.appointmentsToday.change}
                    trend={stats.appointmentsToday.trend}
                    iconBg="bg-purple-500"
                />
                <StatCard
                    icon={DollarSign}
                    label="Revenue (MTD)"
                    value={stats.revenue.value}
                    change={stats.revenue.change}
                    trend={stats.revenue.trend}
                    iconBg="bg-green-500"
                />
                <StatCard
                    icon={Activity}
                    label="Active Doctors"
                    value={stats.activeDoctors.value}
                    change={stats.activeDoctors.change}
                    trend={stats.activeDoctors.trend}
                    iconBg="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8">

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ActionButton icon={Users} label="New Patient" color="text-blue-600 bg-blue-50" />
                            <ActionButton icon={Calendar} label="Book Appointment" color="text-purple-600 bg-purple-50" />
                            <ActionButton icon={FileText} label="New Prescription" color="text-green-600 bg-green-50" />
                            <ActionButton icon={Activity} label="Lab Results" color="text-orange-600 bg-orange-50" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-800">Today's Appointments</h3>
                            <button className="text-sm text-primary font-medium hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {todaysAppointments.map(apt => (
                                <div key={apt.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                            {apt.patientName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">{apt.patientName}</h4>
                                            <div className="flex text-xs text-gray-500 gap-2">
                                                <span>{apt.doctorName}</span>
                                                <span>• {apt.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                                ${apt.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : ''}
                                ${apt.status === 'Completed' ? 'bg-green-100 text-green-700' : ''}
                                ${apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
                                ${apt.status === 'Scheduled' ? 'bg-orange-100 text-orange-700' : ''}
                            `}>
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="h-[400px]">
                        <ActiveDoctors doctors={activeDoctors} />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Department Overview</h3>
                        <div className="space-y-4">
                            <DeptBar label="Cardiology" count={234} total={300} color="bg-red-500" />
                            <DeptBar label="Neurology" count={189} total={300} color="bg-purple-500" />
                            <DeptBar label="Orthopedics" count={156} total={300} color="bg-blue-500" />
                            <DeptBar label="Pediatrics" count={288} total={300} color="bg-green-500" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ActionButton = ({ icon: Icon, label, color }) => (
    <button className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition-colors gap-2 group">
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <span className="text-xs font-medium text-gray-600">{label}</span>
    </button>
);

const DeptBar = ({ label, count, total, color }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="text-gray-500">{count}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${(count / total) * 100}%` }}></div>
        </div>
    </div>
);

export default DashboardView;
