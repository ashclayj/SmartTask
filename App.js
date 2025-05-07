import React, { useState, useEffect } from 'react';
import Tasks from './Tasks';
import Login from './login';
import './index.css';
import Dashboard from './Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">SmartTasks</h1>
  
      {loggedIn ? (
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
  
          {/* ✅ Show Dashboard First */}
          <Dashboard />
  
          {/* ✅ Then show Task list */}
          <Tasks />
        </div>
      ) : (
        <Login onLogin={() => setLoggedIn(true)} />
      )}
    </div>
  );
}  

export default App;

