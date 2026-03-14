import express from "express";
import {
  submitExam,
  getMyResults,
  getExamResults,
  getAllResults,
} from "../controllers/resultController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, submitExam);
router.route("/myresults").get(protect, getMyResults);
router.route("/all").get(protect, admin, getAllResults);
router.route("/exam/:examId").get(protect, admin, getExamResults);

export default router;
