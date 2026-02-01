import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (formData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("https://college-management-system-nnkd.onrender.com/api/students/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { Authorization: token }
      });

      alert("Password changed successfully!");
      navigate('/profile');
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div className="card fade-in" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <h1>🔐 Change Password</h1>
            <button onClick={() => navigate('/profile')} className="btn btn-secondary">
              Back to Profile
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current Password:</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
                placeholder="Enter your current password"
              />
            </div>

            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                placeholder="Enter new password (min 6 characters)"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm new password"
                minLength="6"
              />
            </div>

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Changing...' : '🔄 Change Password'}
              </button>
              <button type="button" onClick={() => navigate('/profile')} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}