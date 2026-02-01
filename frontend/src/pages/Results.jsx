import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from '../components/Layout';

export default function Results() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get("https://college-management-system-nnkd.onrender.com/api/results/my", {
        headers: { Authorization: localStorage.getItem("token") }
      });
      setResults(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    }
  };

  const downloadResult = async (resultId, semester) => {
    try {
      const response = await axios.get(`https://college-management-system-nnkd.onrender.com/api/results/download/${resultId}`, {
        headers: { Authorization: localStorage.getItem("token") },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `result_semester_${semester}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download result");
    }
  };

  const downloadResultPDF = async (resultId, semester) => {
    try {
      const response = await axios.get(`https://college-management-system-nnkd.onrender.com/api/results/pdf/${resultId}`, {
        headers: { Authorization: localStorage.getItem("token") },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `result_semester_${semester}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download result PDF");
    }
  };

  return (
    <Layout userType="student">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">My Results</h2>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Semester {result.semester}</h3>
                {result.filePath ? (
                  <button
                    onClick={() => downloadResult(result._id, result.semester)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Download Result
                  </button>
                ) : (
                  <div>
                    <div className="mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Marks</h4>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{Number(result.total)}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Grade</h4>
                          <p className="text-2xl font-bold text-green-800 dark:text-green-200">{result.grade}</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">Percentage</h4>
                          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                            {result.subjects && result.subjects.length > 0 ? ((Number(result.total) / (result.subjects.length * 100)) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600 mb-4">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600 font-semibold">Subject</th>
                          <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600 font-semibold">Marks</th>
                          <th className="px-4 py-3 text-left border border-gray-300 dark:border-gray-600 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.subjects.map((subject, i) => (
                          <tr key={i} className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">{subject.name}</td>
                            <td className="px-4 py-3 border border-gray-300 dark:border-gray-600 font-medium">{Number(subject.marks)}</td>
                            <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                Number(subject.marks) >= 40 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {Number(subject.marks) >= 40 ? 'Pass' : 'Fail'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-center">
                      <button
                        onClick={() => downloadResultPDF(result._id, result.semester)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
                      >
                        📄 Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No results available</p>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
}
