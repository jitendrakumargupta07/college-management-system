import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const res = await axios.get("https://college-management-system-nnkd.onrender.com/api/fees/status", {
        headers: { Authorization: token }
      });
      setFees(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch fees:", error);
      setError(error.response?.data?.msg || error.message);
    } finally {
      setLoading(false);
    }
  };

  const payFees = async (feeId) => {
    try {
      await axios.post("https://college-management-system-nnkd.onrender.com/api/fees/pay", { feeId }, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      alert("Fees Paid Successfully");
      fetchStatus();
    } catch (error) {
      alert("Failed to pay fees: " + (error.response?.data?.msg || error.message));
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const pendingFees = fees.filter(fee => !fee.paid);
  const paidFees = fees.filter(fee => fee.paid);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '2rem 0' }}>
      <div className="container">
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Fees Section</h2>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading fees...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" style={{ marginBottom: '2rem' }}>
              <p>Error: {error}</p>
              <button 
                onClick={fetchStatus}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>

          {pendingFees.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#e74c3c' }}>Pending Fees</h3>
              {pendingFees.map(fee => (
                <div key={fee._id} style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e74c3c' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Fee Request</h4>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                    Amount: ₹{fee.amount}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                    Created: {fee.createdAt ? new Date(fee.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <button
                    onClick={() => payFees(fee._id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    style={{ marginTop: '1rem' }}
                  >
                    Pay Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {paidFees.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#27ae60' }}>Paid Fees</h3>
              {paidFees.map(fee => (
                <div key={fee._id} style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #27ae60' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Fee Payment</h4>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                    Amount: ₹{fee.amount}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                    Paid on: {fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-center" style={{ marginTop: '1rem' }}>
                    ✅ Paid Successfully
                  </div>
                </div>
              ))}
            </div>
          )}

          {fees.length === 0 && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md text-center">
              <p>No fee records found. Please contact administration if you believe this is an error.</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
