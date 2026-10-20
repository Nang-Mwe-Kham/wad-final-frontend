// src/App.jsx

import { useContext, useState } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";

function DashboardContainer() {
  const { user, loading } = useContext(UserContext);
  const [studentTab, setStudentTab] = useState("browse");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            Loading CourseHub...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar activeTab={studentTab} setActiveTab={setStudentTab} />
      <main className="flex-1">
        {user.role === "Teacher" ? (
          <TeacherDashboard />
        ) : (
          <StudentDashboard
            activeTab={studentTab}
            setActiveTab={setStudentTab}
          />
        )}
      </main>
    </div>
  );
}

function LoginContainer() {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/" element={<DashboardContainer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
