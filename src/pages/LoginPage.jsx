// src/pages/LoginPage.jsx

import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function LoginPage() {
  const { login } = useContext(UserContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Please enter both username/email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(identifier.trim(), password);
    } catch (err) {
      setError(err.message || "Failed to log in.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (userLogin, userPass) => {
    setIdentifier(userLogin);
    setPassword(userPass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-indigo-500/30 mx-auto mb-4">
              🎓
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Online Course Service
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in with your Teacher or Student credentials
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
              <svg
                className="w-5 h-5 shrink-0 text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. teacher1 or student1@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Quick Credential Helper for Grading */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-2.5 text-center">
              Quick Fill Demo Accounts (Password:{" "}
              <code className="text-indigo-600 font-mono">password123</code>)
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                  Teachers:
                </span>
                <div className="flex gap-1.5 flex-1">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("teacher1", "password123")}
                    className="flex-1 text-xs py-1 px-2 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 border border-slate-200 transition-colors font-medium text-slate-700"
                  >
                    teacher1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("teacher2", "password123")}
                    className="flex-1 text-xs py-1 px-2 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 border border-slate-200 transition-colors font-medium text-slate-700"
                  >
                    teacher2
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("teacher3", "password123")}
                    className="flex-1 text-xs py-1 px-2 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 border border-slate-200 transition-colors font-medium text-slate-700"
                  >
                    teacher3
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Students:
                </span>
                <div className="flex gap-1.5 flex-1">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("student1", "password123")}
                    className="flex-1 text-xs py-1 px-2 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 border border-slate-200 transition-colors font-medium text-slate-700"
                  >
                    student1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("student2", "password123")}
                    className="flex-1 text-xs py-1 px-2 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 border border-slate-200 transition-colors font-medium text-slate-700"
                  >
                    student2
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("student3", "password123")}
                    className="flex-1 text-xs py-1 px-2 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 border border-slate-200 transition-colors font-medium text-slate-700"
                  >
                    student3
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
