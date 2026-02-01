import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdmitCard() {
  const navigate = useNavigate();

  const downloadAdmitCard = async () => {
    try {
      const response = await axios.get("https://college-management-system-nnkd.onrender.com/api/admit-cards/download", {
        headers: { Authorization: localStorage.getItem("token") },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'admit_card.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download admit card");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '2rem 0' }}>
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Download Admit Card</h2>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#3498db',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '2rem'
            }}>
              📄
            </div>
            <p style={{ color: '#7f8c8d' }}>
              Download your admit card for upcoming examinations
            </p>
          </div>

          <button
            onClick={downloadAdmitCard}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', marginBottom: '1rem' }}
          >
            Download PDF
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
