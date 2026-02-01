import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ExamTimeTable() {
  const [timeTables, setTimeTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTimeTables = async () => {
      try {
        const response = await axios.get("https://college-management-system-nnkd.onrender.com/api/exam-timetable", {
          headers: { Authorization: token }
        });
        setTimeTables(response.data);
      } catch (error) {
        alert("Failed to load exam time table");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeTables();
  }, [navigate]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loading"></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div className="card fade-in">
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <h1>📅 Exam Time Table</h1>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Back to Dashboard
            </button>
          </div>

          {timeTables.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>No exam schedules available</h3>
              <p>Exam time tables will be published here when available.</p>
            </div>
          ) : (
            timeTables.map((timeTable, index) => (
              <div key={index} className="time-table-card" style={{ marginBottom: '2rem' }}>
                <div className="time-table-header">
                  <h3>{timeTable.course} - Semester {timeTable.semester}</h3>
                  <span className="badge">Active</span>
                </div>

                <div className="exam-list">
                  {timeTable.exams.map((exam, examIndex) => (
                    <div key={examIndex} className="exam-item">
                      <div className="exam-info">
                        <h4>{exam.subject}</h4>
                        <div className="exam-details">
                          <span>📅 {new Date(exam.date).toLocaleDateString()}</span>
                          <span>🕐 {exam.time}</span>
                          <span>🏫 {exam.venue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}