// src/components/TeacherDashboard.jsx

import { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import CourseModal from "./CourseModal";
import CourseDetailsModal from "./CourseDetailsModal";

export default function TeacherDashboard() {
  const { user, authFetch } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] =
    useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const fetchMyCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await authFetch("/course");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to load courses");
      }
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  const handleOpenCreateModal = () => {
    setSelectedCourseForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setSelectedCourseForEdit(course);
    setIsModalOpen(true);
  };

  const handleOpenDetails = async (courseId) => {
    try {
      const res = await authFetch(`/course/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCourseForDetails(data);
        setIsDetailsOpen(true);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to fetch course details");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveCourse = async (courseData, courseId) => {
    const isEdit = Boolean(courseId);
    const url = isEdit ? `/course/${courseId}` : "/course";
    const method = isEdit ? "PUT" : "POST";

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(courseData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to save course");
    }

    setSuccessMsg(
      isEdit ? "Course updated successfully!" : "Course created successfully!",
    );
    setTimeout(() => setSuccessMsg(""), 4000);
    fetchMyCourses();
  };

  const handleDeleteCourse = async (course) => {
    if (course.enrolledCount > 0) {
      alert("Cannot delete course: Students are already enrolled.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete course "${course.courseName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(course.id);
      setError("");
      const res = await authFetch(`/course/${course.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete course");
      }

      setSuccessMsg("Course deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchMyCourses();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Stats calculation
  const totalCourses = courses.length;
  const activeStudents = courses.reduce(
    (acc, curr) => acc + (curr.enrolledCount || 0),
    0,
  );
  const openCourses = courses.filter((c) => c.status === "Open").length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome & Action Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md bg-white/10 text-indigo-200">
            Instructor Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-sm text-indigo-200 mt-1 max-w-xl">
            Manage your courses, track student enrollments, and publish new
            educational programs.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white text-indigo-900 hover:bg-indigo-50 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <svg
            className="w-5 h-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create New Course</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
            📚
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {totalCourses}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Courses
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
            👥
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {activeStudents}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            ⚡
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">
              {openCourses}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Open Courses
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-rose-500 hover:text-rose-700"
          >
            ✕
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
          {successMsg}
        </div>
      )}

      {/* Courses List Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            My Courses ({courses.length})
          </h2>
          <button
            onClick={fetchMyCourses}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading your courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl mx-auto mb-3">
              📖
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No courses created yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Get started by clicking &quot;Create New Course&quot; to build your
              first offering.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              + Create Your First Course
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Course Name</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Students / Max</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => {
                  const enrolled = course.enrolledCount || 0;
                  const canDelete = enrolled === 0;

                  return (
                    <tr
                      key={course.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {course.courseName}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {course.topics?.map((topic, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {course.duration} days
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${course.price}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              enrolled >= course.maxStudents
                                ? "text-rose-600"
                                : "text-slate-800"
                            }`}
                          >
                            {enrolled} / {course.maxStudents}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            course.status === "Open"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : course.status === "Close"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        {/* View Details */}
                        <button
                          onClick={() => handleOpenDetails(course.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(course)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>

                        {/* Delete: Only allowed when no students enrolled */}
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          disabled={!canDelete || deletingId === course.id}
                          title={
                            canDelete
                              ? "Delete course"
                              : "Cannot delete: students have already enrolled"
                          }
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                            canDelete
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                              : "bg-slate-100 text-slate-300 cursor-not-allowed"
                          }`}
                        >
                          {deletingId === course.id ? "..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCourse}
        course={selectedCourseForEdit}
      />

      <CourseDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        course={selectedCourseForDetails}
        isTeacher={true}
      />
    </div>
  );
}
