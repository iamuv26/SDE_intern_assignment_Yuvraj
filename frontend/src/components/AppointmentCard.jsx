import React from 'react';
import { Clock, Video, Phone, MapPin } from 'lucide-react';

const AppointmentCard = ({ appointment, onClick, onStatusUpdate }) => {
    const { patientName, time, duration, status, mode, type } = appointment;

    // Status Colors
    const statusStyles = {
        Upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
        Completed: 'bg-green-100 text-green-700 border-green-200',
        Cancelled: 'bg-red-100 text-red-700 border-red-200',
        Scheduled: 'bg-orange-100 text-orange-700 border-orange-200',
    };

    const getModeIcon = () => {
        switch (mode) {
            case 'Video': return <Video size={14} />;
            case 'Phone': return <Phone size={14} />;
            default: return <MapPin size={14} />;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
        p-4 rounded-xl border border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white mb-3
        ${status === 'Upcoming' ? 'border-l-primary' : ''}
        ${status === 'Scheduled' ? 'border-l-secondary' : ''}
        ${status === 'Completed' ? 'border-l-green-500' : ''}
        ${status === 'Cancelled' ? 'border-l-red-500' : ''}
      `}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{patientName}</h4>
                <span className={`text-xs px-2 py-1 rounded-full border ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>
                    {status}
                </span>
            </div>

            <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                <Clock size={14} />
                {time} ({duration}m)
            </div>

            <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    {getModeIcon()}
                    {mode}
                </div>
                <div className="text-xs text-gray-400 italic">
                    {type}
                </div>
            </div>

            {/* Quick Actions (Hover) */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 justify-end">
                {status !== 'Cancelled' && status !== 'Completed' && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onStatusUpdate(appointment.id, 'Cancelled'); }}
                        className="text-xs text-red-500 hover:text-red-700"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default AppointmentCard;
