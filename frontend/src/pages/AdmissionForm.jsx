import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from '../components/Layout';

export default function AdmissionForm() {
  const [form, setForm] = useState({ address:"", phone:"", dob:"" });
  const navigate = useNavigate();

  const submit = async () => {
    await axios.post("https://college-management-system-nnkd.onrender.com/api/students/admission", form, {
      headers: { Authorization: localStorage.getItem("token") }
    });
    alert("Admission Submitted");
  };

  return (
    <Layout userType="student">
      <div className="p-6">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Admission Form</h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address:</label>
              <input
                type="text"
                required
                placeholder="Enter your full address"
                onChange={e=>setForm({...form, address:e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number:</label>
              <input
                type="tel"
                required
                placeholder="Enter your phone number"
                onChange={e=>setForm({...form, phone:e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth:</label>
              <input
                type="date"
                required
                onChange={e=>setForm({...form, dob:e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={submit}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
