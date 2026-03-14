import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { Clock, AlertCircle } from "lucide-react";

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await api.get(`/exams/${id}`);
        setExam(data);
        setTimeLeft(data.timeLimit * 60); // Convert minutes to seconds

        // Initialize empty answers array
        const initialAnswers = data.questions.map((q) => ({
          questionId: q._id,
          selectedOption: -1, // -1 means unattempted
        }));
        setAnswers(initialAnswers);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch exam", error);
        alert("Failed to load exam. Redirecting...");
        navigate("/student/dashboard");
      }
    };
    fetchExam();
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (!loading && timeLeft === 0) {
      handleAutoSubmit();
    }
  }, [timeLeft, loading]);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((ans) =>
        ans.questionId === questionId
          ? { ...ans, selectedOption: optionIndex }
          : ans,
      ),
    );
  };

  const handleAutoSubmit = async () => {
    await submitExam();
    alert("Time is up! Exam submitted automatically.");
  };

  const submitExam = async () => {
    try {
      await api.post("/results", {
        examId: id,
        answers: answers.filter((a) => a.selectedOption !== -1), // Send only attempted
      });
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Failed to submit exam", error);
      alert("Failed to submit exam. Please contact admin.");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to finalize and submit?")) {
      submitExam();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-xl font-medium">
        Loading Exam...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto border-t-8 border-blue-600 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Sticky Header with Timer */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {exam.questions.length} Questions
            </p>
          </div>

          <div
            className={`flex items-center px-4 py-2 rounded-full font-mono text-xl font-bold ${
              timeLeft < 300
                ? "bg-red-100 text-red-600 animate-pulse"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            <Clock className="w-5 h-5 mr-2" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleManualSubmit} className="p-6 space-y-8">
          {exam.description && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm text-blue-700">{exam.description}</p>
            </div>
          )}

          {exam.questions.map((q, index) => {
            const studentAns = answers.find((a) => a.questionId === q._id);

            return (
              <div
                key={q._id}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    <span className="text-blue-600 mr-2">{index + 1}.</span>
                    {q.questionText}
                  </h3>
                  <span className="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {q.marks} Pts
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {q.options.map((opt, oIndex) => (
                    <label
                      key={oIndex}
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        studentAns?.selectedOption === oIndex
                          ? "bg-blue-50 border-blue-500 shadow-sm"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q._id}`}
                        value={oIndex}
                        checked={studentAns?.selectedOption === oIndex}
                        onChange={() => handleOptionChange(q._id, oIndex)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 block text-sm font-medium text-gray-700">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="pt-6 border-t flex items-center justify-between">
            <div className="flex items-center text-sm text-amber-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              Ensure all questions are answered before submitting.
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold transition-colors shadow-md text-lg"
            >
              Submit Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeExam;
