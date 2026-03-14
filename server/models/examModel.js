import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true }, // Index of the correct option
  marks: { type: Number, required: true, default: 1 },
});

const examSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    timeLimit: { type: Number, required: true }, // in minutes
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    questions: [questionSchema],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
