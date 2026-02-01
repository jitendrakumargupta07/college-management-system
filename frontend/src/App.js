import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdmissionForm from "./pages/AdmissionForm";
import Fees from "./pages/Fees";
import Results from "./pages/Results";
import AdmitCard from "./pages/AdmitCard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ExamTimeTable from "./pages/ExamTimeTable";
import Notices from "./pages/Notices";
import Subjects from "./pages/Subjects";
import Certificates from "./pages/Certificates";

function App() {
  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admission" element={<AdmissionForm />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/results" element={<Results />} />
        <Route path="/admit-card" element={<AdmitCard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/exam-timetable" element={<ExamTimeTable />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/certificates" element={<Certificates />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
