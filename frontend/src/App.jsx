import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import DashboardView from './components/DashboardView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // Default to Dashboard

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      {currentView === 'calendar' ? <CalendarView /> : <DashboardView />}
    </div>
  );
}

export default App;
