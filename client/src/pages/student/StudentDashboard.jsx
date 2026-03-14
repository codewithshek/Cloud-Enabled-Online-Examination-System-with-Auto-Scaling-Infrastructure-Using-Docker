import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { LogOut, GraduationCap, Clock, Award, PlayCircle } from "lucide-react";

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [examsRes, resultsRes] = await Promise.all([
          api.get("/exams"),
          api.get("/results/myresults"),
        ]);
        setExams(examsRes.data);
        setResults(resultsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
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
              <GraduationCap className="h-8 w-8 text-green-600 mr-2" />
              <span className="font-bold text-xl text-gray-900">
                Student Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                Hello, {user?.name}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg mb-6 flex-1">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Available Exams
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {exams.filter(
                  (e) =>
                    e.isActive && !results.find((r) => r.exam._id === e._id),
                ).length === 0 ? (
                  <li className="px-4 py-8 text-center text-gray-500">
                    No new exams available at the moment.
                  </li>
                ) : (
                  exams
                    .filter(
                      (e) =>
                        e.isActive &&
                        !results.find((r) => r.exam._id === e._id),
                    )
                    .map((exam) => (
                      <li
                        key={exam._id}
                        className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex justify-between items-center group"
                      >
                        <div>
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {exam.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {exam.questions.length} Questions | {exam.timeLimit}{" "}
                            Mins
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/student/exam/${exam._id}`)}
                          className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 transition opacity-0 group-hover:opacity-100"
                        >
                          <PlayCircle className="h-4 w-4 mr-1" /> Start
                        </button>
                      </li>
                    ))
                )}
              </ul>
            </div>

            <div className="bg-white shadow rounded-lg mb-6 flex-1">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  My Results
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {results.length === 0 ? (
                  <li className="px-4 py-8 text-center text-gray-500">
                    You haven't taken any exams yet.
                  </li>
                ) : (
                  results.map((result) => (
                    <li
                      key={result._id}
                      className="px-4 py-4 sm:px-6 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.exam?.title || "Unknown Exam"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-lg font-bold ${
                            result.score / result.totalMarks >= 0.5
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {result.score} / {result.totalMarks}
                        </span>
                        <span className="text-xs text-gray-500">Score</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
