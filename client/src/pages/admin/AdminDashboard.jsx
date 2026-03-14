import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { LogOut, PlusCircle, BookOpen, Users, Activity } from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [activeStudents, setActiveStudents] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [examsRes, resultsRes] = await Promise.all([
          api.get("/exams"),
          api.get("/results/all")
        ]);
        
        setExams(examsRes.data);
        
        const results = resultsRes.data;
        if (results.length > 0) {
          // Calculate unique active students
          const uniqueStudents = new Set(results.map(r => r.student.toString()));
          setActiveStudents(uniqueStudents.size);
          
          // Calculate average score percentage
          const totalPercentage = results.reduce((acc, curr) => {
            return acc + (curr.score / curr.totalMarks) * 100;
          }, 0);
          setAverageScore((totalPercentage / results.length).toFixed(1));
        } else {
          setActiveStudents(0);
          setAverageScore(0);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl text-gray-900">
                Admin Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Exams</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {exams.length}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Students
                </p>
                <p className="text-2xl font-semibold text-gray-900">{activeStudents}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <Activity className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                <p className="text-2xl font-semibold text-gray-900">{averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Manage Exams
              </h3>
              <button
                onClick={() => navigate("/admin/exams/new")}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Exam
              </button>
            </div>
            <ul className="divide-y divide-gray-200">
              {exams.length === 0 ? (
                <li className="px-4 py-8 text-center text-gray-500">
                  No exams created yet. Start by creating a new exam.
                </li>
              ) : (
                exams.map((exam) => (
                  <li
                    key={exam._id}
                    className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {exam.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {exam.questions.length} Questions | {exam.timeLimit}{" "}
                        Minutes
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          exam.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {exam.isActive ? "Active" : "Draft"}
                      </span>
                      <button
                        onClick={() => navigate(`/admin/exams/${exam._id}/results`)}
                        className="ml-4 text-sm text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View Results
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
