import Result from "../models/resultModel.js";
import Exam from "../models/examModel.js";

// @desc    Submit exam and calculate score
// @route   POST /api/results
// @access  Private/Student
export const submitExam = async (req, res) => {
  const { examId, answers } = req.body;

  const exam = await Exam.findById(examId);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  let score = 0;
  let totalMarks = 0;
  const processedAnswers = [];

  exam.questions.forEach((question) => {
    totalMarks += question.marks;

    // Find the student's answer for this question
    const studentAnswer = answers.find(
      (a) => a.questionId.toString() === question._id.toString(),
    );

    let isCorrect = false;
    let selectedOption = -1;

    if (studentAnswer) {
      selectedOption = studentAnswer.selectedOption;
      if (selectedOption === question.correctOption) {
        isCorrect = true;
        score += question.marks;
      }
    }

    processedAnswers.push({
      questionId: question._id,
      selectedOption,
      isCorrect,
    });
  });

  const result = new Result({
    exam: examId,
    student: req.user._id,
    score,
    totalMarks,
    answers: processedAnswers,
  });

  const createdResult = await result.save();
  res.status(201).json(createdResult);
};

// @desc    Get results for a student
// @route   GET /api/results/myresults
// @access  Private/Student
export const getMyResults = async (req, res) => {
  const results = await Result.find({ student: req.user._id }).populate(
    "exam",
    "title",
  );
  res.json(results);
};

// @desc    Get all results for an exam (Admin)
// @route   GET /api/results/exam/:examId
// @access  Private/Admin
export const getExamResults = async (req, res) => {
  const results = await Result.find({ exam: req.params.examId }).populate(
    "student",
    "name email",
  );
  res.json(results);
};

// @desc    Get all global results for Dashboard calculations
// @route   GET /api/results/all
// @access  Private/Admin
export const getAllResults = async (req, res) => {
  const results = await Result.find({});
  res.json(results);
};
