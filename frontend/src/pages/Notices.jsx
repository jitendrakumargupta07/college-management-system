import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchNotices = async () => {
      try {
        const response = await axios.get("https://college-management-system-nnkd.onrender.com/api/notices", {
          headers: { Authorization: token }
        });
        setNotices(response.data);
      } catch (error) {
        alert("Failed to load notices");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [navigate]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#3498db';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'exam': return '📝';
      case 'fee': return '💰';
      case 'admission': return '📋';
      default: return '📢';
    }
  };

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
            <h1>📢 Notices & Announcements</h1>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Back to Dashboard
            </button>
          </div>

          {notices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>No notices available</h3>
              <p>Important announcements will be posted here.</p>
            </div>
          ) : (
            <div className="notices-list">
              {notices.map((notice, index) => (
                <div key={notice._id} className="notice-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="notice-header">
                    <div className="notice-title">
                      <span className="notice-icon">{getTypeIcon(notice.type)}</span>
                      <h3>{notice.title}</h3>
                    </div>
                    <div className="notice-meta">
                      <span
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(notice.priority) }}
                      >
                        {notice.priority.toUpperCase()}
                      </span>
                      <span className="notice-date">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="notice-content">
                    <p>{notice.content}</p>
                  </div>

                  {notice.createdBy && (
                    <div className="notice-footer">
                      <small>Posted by: {notice.createdBy.name}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}