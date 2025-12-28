import React from 'react';
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    Settings,
    Plus,
    Search,
    MessageSquare
} from 'lucide-react';

const Sidebar = ({ currentView, onNavigate }) => {
    return (
        <div className="h-screen w-16 md:w-20 flex flex-col items-center bg-white border-r border-gray-200 py-6 space-y-8 fixed left-0 top-0 z-50">
            {/* Search Icon */}
            <div className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 cursor-pointer">
                <Search size={24} />
            </div>

            {/* Main Nav Items */}
            <nav className="flex flex-col space-y-4 w-full items-center">
                <NavItem
                    icon={<LayoutDashboard size={24} />}
                    active={currentView === 'dashboard'}
                    onClick={() => onNavigate('dashboard')}
                />
                <NavItem icon={<Users size={24} />} />
                <NavItem
                    icon={<Calendar size={24} />}
                    active={currentView === 'calendar'}
                    onClick={() => onNavigate('calendar')}
                />
                <NavItem icon={<FileText size={24} />} />
                <NavItem icon={<MessageSquare size={24} />} />
            </nav>

            {/* Floating Action Button */}
            <div className="mt-auto mb-4">
                <button className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">
                    <Plus size={24} />
                </button>
            </div>

            {/* Settings */}
            <div className="mt-auto">
                <div className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 cursor-pointer">
                    <Settings size={24} />
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ icon, active, onClick }) => (
    <div
        onClick={onClick}
        className={`
    p-3 rounded-xl cursor-pointer transition-colors
    ${active ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
  `}>
        {icon}
    </div>
);

export default Sidebar;
