// src/components/CourseModal.jsx

import { useState, useEffect } from "react";

export default function CourseModal({ isOpen, onClose, onSave, course }) {
  const isEditing = Boolean(course);

  const [courseName, setCourseName] = useState("");
  const [duration, setDuration] = useState("");
  const [topicsInput, setTopicsInput] = useState("");
  const [price, setPrice] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [status, setStatus] = useState("Open");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (course) {
      setCourseName(course.courseName || "");
      setDuration(course.duration || "");
      setTopicsInput(
        Array.isArray(course.topics) ? course.topics.join(", ") : "",
      );
      setPrice(course.price !== undefined ? course.price : "");
      setMaxStudents(course.maxStudents || "");
      setStatus(course.status || "Open");
    } else {
      setCourseName("");
      setDuration("");
      setTopicsInput("");
      setPrice("");
      setMaxStudents("");
      setStatus("Open");
    }
    setError("");
  }, [course, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!courseName.trim()) {
      setError("Course name is required.");
      return;
    }
    const dur = Number(duration);
    if (isNaN(dur) || dur <= 0) {
      setError("Duration must be a positive number of days.");
      return;
    }
    const pr = Number(price);
    if (isNaN(pr) || pr < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }
    const maxS = Number(maxStudents);
    if (isNaN(maxS) || maxS <= 0) {
      setError("Max Student must be a positive number.");
      return;
    }
    if (isEditing && course?.enrolledCount && maxS < course.enrolledCount) {
      setError(
        `Max Student cannot be less than current enrolled students (${course.enrolledCount}).`,
      );
      return;
    }

    const topicsArray = topicsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (topicsArray.length === 0) {
      setError("Please specify at least one topic (separated by commas).");
      return;
    }

    const payload = {
      courseName: courseName.trim(),
      duration: dur,
      topics: topicsArray,
      price: pr,
      maxStudents: maxS,
      status,
    };

    try {
      setSaving(true);
      await onSave(payload, course?.id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? "Edit Course" : "Create New Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course Name *
            </label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g. Modern Fullstack Web Development"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 199"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Max Student *
              </label>
              <input
                type="number"
                min="1"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                placeholder="e.g. 20"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              {isEditing && course?.enrolledCount !== undefined && (
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Currently enrolled: {course.enrolledCount}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Open">Open (Available)</option>
                <option value="Close">Close (Read-only)</option>
                <option value="Cancel">Cancel (Hidden from Students)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Topics (Comma-separated) *
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder="e.g. React, Next.js, Node.js, MongoDB"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Multiple topics are allowed. Separate each topic with a comma.
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {saving
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Course"
                  : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
