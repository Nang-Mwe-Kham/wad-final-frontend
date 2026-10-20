// src/components/Navbar.jsx

import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useContext(UserContext);

  if (!user) return null;

  const isTeacher = user.role === "Teacher";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-200">
              🎓
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                CourseHub
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Online Service
              </span>
            </div>
          </div>

          {/* Role Navigation Tabs if Student */}
          {!isTeacher && setActiveTab && (
            <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("browse")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "browse"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Browse Courses
              </button>
              <button
                onClick={() => setActiveTab("my-enrollments")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "my-enrollments"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                My Enrolled Courses
              </button>
            </div>
          )}

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-800 leading-tight">
                {user.username}
              </div>
              <div className="text-xs text-slate-500">{user.email}</div>
            </div>

            {/* Role Badge */}
            <span
              className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
                isTeacher
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {user.role}
            </span>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Log out"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
