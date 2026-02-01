import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Certificates() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
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
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleDownloadCertificate = async () => {
    if (!student || student.admissionStatus !== 'Approved') {
      alert("Certificate is only available for approved students.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://college-management-system-nnkd.onrender.com/api/students/certificate", {
        headers: { Authorization: token },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${student.name}_certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download certificate");
    } finally {
      setLoading(false);
    }
  };

  if (!student) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loading"></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div className="card fade-in">
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <h1>🧾 Download Certificates</h1>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Back to Dashboard
            </button>
          </div>

          <div className="certificates-section">
            <div className="certificate-card">
              <div className="certificate-icon">📜</div>
              <h3>Certificate of Enrollment</h3>
              <p>
                Official certificate confirming your enrollment in {student.course}.
                This certificate verifies your student status and course enrollment.
              </p>

              <div className="certificate-requirements">
                <h4>Requirements:</h4>
                <ul>
                  <li>Admission Status: <span style={{
                    color: student.admissionStatus === 'Approved' ? '#27ae60' : '#e74c3c',
                    fontWeight: '600'
                  }}>{student.admissionStatus}</span></li>
                  <li>Fee Status: <span style={{
                    color: student.feePaid ? '#27ae60' : '#e74c3c',
                    fontWeight: '600'
                  }}>{student.feePaid ? 'Paid' : 'Pending'}</span></li>
                </ul>
              </div>

              <div className="certificate-actions">
                <button
                  onClick={handleDownloadCertificate}
                  className="btn btn-primary"
                  disabled={loading || student.admissionStatus !== 'Approved'}
                >
                  {loading ? '⏳ Generating...' : '📥 Download Certificate'}
                </button>

                {student.admissionStatus !== 'Approved' && (
                  <p style={{ color: '#e74c3c', marginTop: '1rem', fontSize: '0.9rem' }}>
                    Certificate is only available for approved students.
                  </p>
                )}
              </div>
            </div>

            <div className="certificate-info">
              <h4>📋 Certificate Information</h4>
              <div className="info-list">
                <div className="info-item">
                  <span>Student Name:</span>
                  <span>{student.name}</span>
                </div>
                <div className="info-item">
                  <span>Course:</span>
                  <span>{student.course}</span>
                </div>
                <div className="info-item">
                  <span>Enrollment Date:</span>
                  <span>{new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span>Certificate Type:</span>
                  <span>Enrollment Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}