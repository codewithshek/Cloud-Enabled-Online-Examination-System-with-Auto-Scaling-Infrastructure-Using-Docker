import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Examination System API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
