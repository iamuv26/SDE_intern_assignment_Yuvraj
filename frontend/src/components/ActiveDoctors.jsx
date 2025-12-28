import React from 'react';

const ActiveDoctors = ({ doctors }) => {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white h-full relative overflow-hidden shadow-lg shadow-blue-500/20">
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-white/90 font-medium">Active Doctors</h3>
                    <div className="text-4xl font-bold mt-1">72<span className="text-xl text-white/60 font-medium">/80</span></div>
                    <div className="text-xs text-blue-100 mt-1">Currently on duty</div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                {doctors.map((doc, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                        <span className="font-medium text-sm">{doc.name}</span>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white">{doc.status}</span>
                    </div>
                ))}
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
        </div>
    );
};

export default ActiveDoctors;
