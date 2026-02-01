import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children, userType = 'student' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024); // lg breakpoint
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const studentNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Admission Form', path: '/admission', icon: '📝' },
    { name: 'Fees Payment', path: '/fees', icon: '💳' },
    { name: 'Exam Time Table', path: '/exam-timetable', icon: '📅' },
    { name: 'Notices', path: '/notices', icon: '📢' },
    { name: 'Results', path: '/results', icon: '📈' },
    { name: 'Admit Card', path: '/admit-card', icon: '🪪' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Students', path: '/admin/dashboard?tab=students', icon: '👥' },
    { name: 'Fees', path: '/admin/dashboard?tab=fees', icon: '💰' },
    { name: 'Results', path: '/admin/dashboard?tab=results', icon: '📊' },
    { name: 'Notices', path: '/admin/dashboard?tab=notices', icon: '📢' },
    { name: 'Exams', path: '/admin/dashboard?tab=exams', icon: '📅' },
    { name: 'Reports', path: '/admin/dashboard?tab=reports', icon: '📋' },
  ];

  const navItems = userType === 'admin' ? adminNavItems : studentNavItems;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-600 dark:bg-indigo-700">
          <h1 className="text-xl font-bold text-white">CMS</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-white hover:bg-indigo-500 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className={`${sidebarOpen ? 'lg:pl-64' : ''}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const newDarkMode = !darkMode;
                  setDarkMode(newDarkMode);
                  localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', newDarkMode);
                }}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                {darkMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {userType === 'admin' ? 'A' : 'S'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userType === 'admin' ? 'Admin User' : 'Student Name'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;