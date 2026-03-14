import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ArrowLeft, Users, CheckCircle, Percent } from "lucide-react";

const ExamResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamAndResults = async () => {
      try {
        const [examRes, resultsRes] = await Promise.all([
          api.get(`/exams/${id}`),
          api.get(`/results/exam/${id}`),
        ]);
        setExam(examRes.data);
        setResults(resultsRes.data);
      } catch (error) {
        console.error("Failed to fetch exam results", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExamAndResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const averageScore =
    results.length > 0
      ? (
          results.reduce((acc, curr) => acc + (curr.score / curr.totalMarks) * 100, 0) /
          results.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">
              Results: {exam?.title || "Exam"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {exam?.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-gray-200">
            <div className="px-6 py-5 flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="text-2xl font-semibold text-gray-900">{results.length}</p>
              </div>
            </div>
            <div className="px-6 py-5 flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500">Highest Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {results.length > 0 ? Math.max(...results.map(r => r.score)) : 0}
                </p>
              </div>
            </div>
            <div className="px-6 py-5 flex items-center">
              <Percent className="h-8 w-8 text-purple-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500">Class Average</p>
                <p className="text-2xl font-semibold text-gray-900">{averageScore}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted On
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No students have taken this exam yet.
                  </td>
                </tr>
              ) : (
                results.map((result) => {
                  const percentage = ((result.score / result.totalMarks) * 100).toFixed(1);
                  return (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.student?.name || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {result.student?.email || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">
                          {result.score} <span className="text-gray-400 font-normal">/ {result.totalMarks}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            percentage >= 50
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()} at{" "}
                        {new Date(result.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
