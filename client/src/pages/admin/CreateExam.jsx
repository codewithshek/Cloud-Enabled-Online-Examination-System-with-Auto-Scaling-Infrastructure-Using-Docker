import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

const CreateExam = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctOption: 0, marks: 1 },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctOption: 0,
        marks: 1,
      },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams", { title, description, timeLimit, questions });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Failed to create exam", error);
      alert("Failed to create exam. Refer to console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Exam Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4 text-gray-900 border-b pb-2">
              Exam Settings
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Exam Title
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Limit (Minutes)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="mt-1 block w-full sm:w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500 relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  disabled={questions.length === 1}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <h3 className="font-medium text-gray-900 mb-4">
                  Question {qIndex + 1}
                </h3>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Enter question text"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={q.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          qIndex,
                          "questionText",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctOption === oIndex}
                          onChange={() =>
                            handleQuestionChange(
                              qIndex,
                              "correctOption",
                              oIndex,
                            )
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <input
                          type="text"
                          required
                          placeholder={`Option ${oIndex + 1}`}
                          className="ml-3 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="w-1/4">
                    <label className="block text-xs font-medium text-gray-500 mt-2 border-t pt-2">
                      Points for this question
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="mt-1 block w-ful border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={q.marks}
                      onChange={(e) =>
                        handleQuestionChange(
                          qIndex,
                          "marks",
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-5 flex justify-end">
            <button
              type="submit"
              className="flex items-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 shadow-lg text-lg font-medium transition-colors"
            >
              <Save className="h-5 w-5 mr-2" />
              Save & Publish Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;
