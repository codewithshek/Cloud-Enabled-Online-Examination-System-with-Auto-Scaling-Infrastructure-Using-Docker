import Exam from "../models/examModel.js";

// @desc    Get all exams (for students)
// @route   GET /api/exams
// @access  Private
export const getExams = async (req, res) => {
  const exams = await Exam.find({ isActive: true }).select(
    "-questions.correctOption",
  );
  res.json(exams);
};

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Private
export const getExamById = async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (exam) {
    if (req.user.role === "Student") {
      // Don't send correct answers to students before submission
      exam.questions.forEach((q) => {
        q.correctOption = undefined;
      });
    }
    res.json(exam);
  } else {
    res.status(404).json({ message: "Exam not found" });
  }
};

// @desc    Create an exam
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = async (req, res) => {
  const { title, description, timeLimit, questions } = req.body;

  const exam = new Exam({
    title,
    description,
    timeLimit,
    questions,
    createdBy: req.user._id,
  });

  const createdExam = await exam.save();
  res.status(201).json(createdExam);
};

// @desc    Update an exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
export const updateExam = async (req, res) => {
  const { title, description, timeLimit, questions, isActive } = req.body;

  const exam = await Exam.findById(req.params.id);

  if (exam) {
    exam.title = title || exam.title;
    exam.description = description || exam.description;
    exam.timeLimit = timeLimit || exam.timeLimit;
    exam.questions = questions || exam.questions;
    exam.isActive = isActive !== undefined ? isActive : exam.isActive;

    const updatedExam = await exam.save();
    res.json(updatedExam);
  } else {
    res.status(404).json({ message: "Exam not found" });
  }
};

// @desc    Delete an exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
export const deleteExam = async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (exam) {
    await exam.deleteOne();
    res.json({ message: "Exam removed" });
  } else {
    res.status(404).json({ message: "Exam not found" });
  }
};
