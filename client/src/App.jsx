import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/layout/PrivateRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateExam from "./pages/admin/CreateExam";
import ExamResults from "./pages/admin/ExamResults";
import StudentDashboard from "./pages/student/StudentDashboard";
import TakeExam from "./pages/student/TakeExam";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={["Admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/exams/new"
          element={
            <PrivateRoute roles={["Admin"]}>
              <CreateExam />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/exams/:id/results"
          element={
            <PrivateRoute roles={["Admin"]}>
              <ExamResults />
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute roles={["Student"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/exam/:id"
          element={
            <PrivateRoute roles={["Student"]}>
              <TakeExam />
            </PrivateRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
