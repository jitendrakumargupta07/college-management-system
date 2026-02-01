import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchSubjects = async () => {
      try {
        const response = await axios.get("https://college-management-system-nnkd.onrender.com/api/subjects", {
          headers: { Authorization: token }
        });
        setSubjects(response.data);
      } catch (error) {
        alert("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
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
            <h1>📚 Subject & Syllabus Information</h1>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Back to Dashboard
            </button>
          </div>

          {subjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h3>No subjects available</h3>
              <p>Subject information will be published here.</p>
            </div>
          ) : (
            <div className="subjects-grid">
              {subjects.map((subject, index) => (
                <div
                  key={subject._id}
                  className="subject-card slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedSubject(selectedSubject?._id === subject._id ? null : subject)}
                >
                  <div className="subject-header">
                    <h3>{subject.name}</h3>
                    <span className="subject-code">{subject.code}</span>
                  </div>

                  <div className="subject-meta">
                    <span>📖 {subject.course}</span>
                    <span>🎓 Semester {subject.semester}</span>
                    <span>⭐ {subject.syllabus?.credits || 0} Credits</span>
                  </div>

                  {selectedSubject?._id === subject._id && (
                    <div className="subject-details">
                      <h4>Syllabus Overview:</h4>
                      <p>{subject.syllabus?.description || 'No description available'}</p>

                      {subject.syllabus?.topics && subject.syllabus.topics.length > 0 && (
                        <div className="topics-list">
                          <h4>Topics Covered:</h4>
                          <ul>
                            {subject.syllabus.topics.map((topic, idx) => (
                              <li key={idx}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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