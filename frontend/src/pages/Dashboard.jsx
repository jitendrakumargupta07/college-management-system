import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from '../components/Layout';

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://college-management-system-nnkd.onrender.com/api/students/profile", {
          headers: { Authorization: token }
        });
        setStudent(response.data);
      } catch (error) {
        alert("Failed to load profile");
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!student) return (
    <Layout userType="student">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </Layout>
  );

  const summaryCards = [
    {
      title: 'Fees',
      value: student.feePaid ? 'Paid' : 'Pending',
      icon: '💰',
      bgColor: 'bg-emerald-500',
      status: student.feePaid ? 'All fees cleared' : 'Payment required',
      trend: student.feePaid ? 'up' : 'down'
    },
    {
      title: 'Admission',
      value: student.admissionStatus,
      icon: '📝',
      bgColor: student.admissionStatus === 'Approved' ? 'bg-blue-500' : 'bg-amber-500',
      status: student.admissionStatus === 'Approved' ? 'Active student' : 'Under review',
      trend: student.admissionStatus === 'Approved' ? 'up' : 'neutral'
    },
    {
      title: 'Result',
      value: 'View',
      icon: '📊',
      bgColor: 'bg-indigo-500',
      status: 'Latest semester results',
      trend: 'neutral'
    },
    {
      title: 'Status',
      value: 'Active',
      icon: '✅',
      bgColor: 'bg-green-500',
      status: 'Current semester',
      trend: 'up'
    }
  ];

  const quickActions = [
    {
      name: 'View Profile',
      path: '/profile',
      icon: '👤',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200 hover:border-blue-300',
      description: 'Update your information'
    },
    {
      name: 'Update Admission',
      path: '/admission',
      icon: '📝',
      color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200 hover:border-emerald-300',
      description: 'Modify admission details'
    },
    {
      name: 'Manage Fees',
      path: '/fees',
      icon: '💳',
      color: 'bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border-amber-200 hover:border-amber-300',
      description: 'Pay fees & view history'
    },
    {
      name: 'View Results',
      path: '/results',
      icon: '📈',
      color: 'bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200 hover:border-indigo-300',
      description: 'Check your grades'
    },
    {
      name: 'Download Admit Card',
      path: '/admit-card',
      icon: '🎓',
      color: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200 hover:border-purple-300',
      description: 'Get exam admit card'
    },
    {
      name: 'Exam Time Table',
      path: '/exam-timetable',
      icon: '📅',
      color: 'bg-gradient-to-br from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border-rose-200 hover:border-rose-300',
      description: 'View exam schedule'
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: '✅',
      title: 'Fee Payment Confirmed',
      message: 'Your semester fee payment has been processed successfully.',
      time: '2 hours ago',
      gradient: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
      border: 'border-emerald-100 dark:border-emerald-800',
      iconBg: 'bg-emerald-500'
    },
    {
      id: 2,
      type: 'info',
      icon: '📢',
      title: 'Exam Schedule Updated',
      message: 'Mid-term examination schedule has been published.',
      time: '1 day ago',
      gradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      border: 'border-blue-100 dark:border-blue-800',
      iconBg: 'bg-blue-500'
    },
    {
      id: 3,
      type: 'warning',
      icon: '⚠️',
      title: 'Document Verification',
      message: 'Please submit your updated address proof by next week.',
      time: '3 days ago',
      gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      border: 'border-amber-100 dark:border-amber-800',
      iconBg: 'bg-amber-500'
    }
  ];

  return (
    <Layout userType="student">
      {/* Top Header Bar with Student Profile */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Welcome back, {student.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Student ID: {student.studentId} • {student.course}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Last login: Today</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Section with Stats */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {student.name}! 🎓</h2>
                  <p className="text-indigo-100 text-lg">Ready to continue your academic journey? Here's your overview.</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{student.studentId}</div>
                    <div className="text-sm text-indigo-100">Student ID</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{student.course}</div>
                    <div className="text-sm text-indigo-100">Course</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">Semester 1</div>
                    <div className="text-sm text-indigo-100">Current</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
          </div>

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, index) => (
              <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 ${card.bgColor} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-white text-2xl">{card.icon}</span>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      card.trend === 'up' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                      card.trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {card.trend === 'up' ? 'Good' : card.trend === 'down' ? 'Action' : 'Info'}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{card.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.status}</p>
                  </div>
                </div>

                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Quick Actions - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Access your most used features</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>6 available</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(action.path)}
                      className={`group relative overflow-hidden rounded-2xl border-2 p-6 ${action.color} transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105`}
                    >
                      <div className="relative z-10">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                        <h3 className="font-semibold text-base mb-1">{action.name}</h3>
                        <p className="text-sm opacity-80">{action.description}</p>
                      </div>
                      {/* Background pattern */}
                      <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Academic Progress Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Progress</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Track your semester performance</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                    View Details →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100, 100" className="text-gray-200 dark:text-gray-700"></path>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="75, 100" className="text-indigo-500"></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">📚</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Course Progress</h4>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">75%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">3 of 4 subjects completed</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-100 dark:border-emerald-800">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100, 100" className="text-gray-200 dark:text-gray-700"></path>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="92, 100" className="text-emerald-500"></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">🎯</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Attendance</h4>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">92%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Excellent attendance</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="100, 100" className="text-gray-200 dark:text-gray-700"></path>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="85, 100" className="text-amber-500"></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">📈</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Performance</h4>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">A-</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Grade average</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Notifications & Activity */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {notifications.length} new
                  </span>
                </div>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-xl bg-gradient-to-r ${notification.gradient} border ${notification.border} hover:shadow-md transition-all duration-200 cursor-pointer`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 ${notification.iconBg} rounded-full flex items-center justify-center text-white text-sm flex-shrink-0`}>
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{notification.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{notification.message}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm py-2">
                  View All Notifications →
                </button>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Last 7 days</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      📝
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Admission form submitted</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-100 dark:border-emerald-800">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm">
                      💰
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Fee payment processed</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                      📊
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Semester results published</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 weeks ago</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 text-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm py-2">
                  View Full Activity →
                </button>
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
}