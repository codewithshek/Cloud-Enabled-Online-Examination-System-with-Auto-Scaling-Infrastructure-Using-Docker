import mongoose from "mongoose";

const resultSchema = mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Exam",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        selectedOption: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Result = mongoose.model("Result", resultSchema);

export default Result;
