// src/components/StudentDashboard.jsx

import { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import CourseDetailsModal from "./CourseDetailsModal";

export default function StudentDashboard({ activeTab, setActiveTab }) {
  const { user, authFetch } = useContext(UserContext);

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [selectedCourseForDetails, setSelectedCourseForDetails] =
    useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [enrollingId, setEnrollingId] = useState(null);

  // Fetch available courses
  const fetchAvailableCourses = useCallback(
    async (search = "") => {
      try {
        setLoading(true);
        setError("");
        const queryParam = search.trim()
          ? `?search=${encodeURIComponent(search.trim())}`
          : "";
        const res = await authFetch(`/course${queryParam}`);
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
    },
    [authFetch],
  );

  // Fetch enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    try {
      const res = await authFetch("/course?enrolled=true");
      if (res.ok) {
        const data = await res.json();
        setEnrolledCourses(data);
      }
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchAvailableCourses(searchQuery);
    fetchEnrolledCourses();
  }, [fetchAvailableCourses, fetchEnrolledCourses, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAvailableCourses(searchQuery);
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
        setError(data.message || "Failed to load course details");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingId(courseId);
      setError("");
      const res = await authFetch(`/course/${courseId}/enroll`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Enrollment failed");
      }

      setSuccessMsg("Successfully enrolled in course!");
      setTimeout(() => setSuccessMsg(""), 4000);

      // Refresh both lists
      await fetchAvailableCourses(searchQuery);
      await fetchEnrolledCourses();

      // If details modal is open, refresh its data
      if (isDetailsOpen && selectedCourseForDetails?.id === courseId) {
        setSelectedCourseForDetails({
          ...selectedCourseForDetails,
          isEnrolled: true,
          enrolledCount: (selectedCourseForDetails.enrolledCount || 0) + 1,
          availableSeats: Math.max(
            0,
            (selectedCourseForDetails.availableSeats || 1) - 1,
          ),
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrollingId(null);
    }
  };

  const currentList = activeTab === "my-enrollments" ? enrolledCourses : courses;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md bg-white/10 text-emerald-200">
            Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Welcome, {user?.username}!
          </h1>
          <p className="text-sm text-emerald-200 mt-1 max-w-xl">
            Explore exciting courses taught by top instructors, expand your
            skillset, and track your ongoing learning.
          </p>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden w-full bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("browse")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
              activeTab === "browse" ? "bg-white text-emerald-900" : "text-white"
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab("my-enrollments")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
              activeTab === "my-enrollments"
                ? "bg-white text-emerald-900"
                : "text-white"
            }`}
          >
            My Courses ({enrolledCourses.length})
          </button>
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

      {/* Search & Filter Bar (Only on Browse tab) */}
      {activeTab === "browse" && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter courses by course name or teacher name..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <svg
                className="w-5 h-5 text-slate-400 absolute left-3 top-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  fetchAvailableCourses("");
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Main Content Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          {activeTab === "browse"
            ? `Available Courses (${courses.length})`
            : `My Enrolled Courses (${enrolledCourses.length})`}
        </h2>
        {activeTab === "browse" && (
          <span className="text-xs text-slate-500">
            Cancel status courses are hidden
          </span>
        )}
      </div>

      {/* Grid of Courses */}
      {loading ? (
        <div className="p-16 text-center text-sm text-slate-500">
          Loading courses...
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
            📚
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {activeTab === "browse"
              ? "No courses found matching your criteria"
              : "You have not enrolled in any courses yet"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === "browse"
              ? "Try adjusting your search keywords or clear filters."
              : "Browse available courses above and enroll in one to begin learning!"}
          </p>
          {activeTab === "my-enrollments" && (
            <button
              onClick={() => setActiveTab("browse")}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
            >
              Browse Available Courses
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((course) => {
            const enrolledCount = course.enrolledCount || 0;
            const maxStudents = course.maxStudents || 0;
            const availableSeats = Math.max(0, maxStudents - enrolledCount);
            const isFull = availableSeats <= 0;
            const isOpen = course.status === "Open";
            const isEnrolled = course.isEnrolled;

            // Enrollment allowed only when:
            // 1. Status is Open
            // 2. Seats still available according to Max Student
            // 3. Student not already enrolled
            const canEnroll = isOpen && !isFull && !isEnrolled;

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Status & Price Row */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        isOpen
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {course.status}
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      ${course.price}
                    </span>
                  </div>

                  {/* Course Title & Teacher */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                    {course.courseName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Instructor:{" "}
                    <span className="font-semibold text-slate-700">
                      {course.teacherName}
                    </span>
                  </p>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{course.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>👥</span>
                      <span
                        className={
                          isFull ? "text-rose-600 font-bold" : "text-slate-700"
                        }
                      >
                        {enrolledCount}/{maxStudents} ({availableSeats} left)
                      </span>
                    </div>
                  </div>

                  {/* Topics Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {course.topics?.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                    {course.topics?.length > 3 && (
                      <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
                        +{course.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenDetails(course.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>

                  {/* Enrollment Button */}
                  {isEnrolled ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                      ✓ Enrolled
                    </span>
                  ) : !isOpen ? (
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                      Closed
                    </span>
                  ) : isFull ? (
                    <span className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
                      Full Capacity
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      {enrollingId === course.id ? "Enrolling..." : "Enroll"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      <CourseDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        course={selectedCourseForDetails}
        isTeacher={false}
        onEnroll={handleEnroll}
        enrolling={enrollingId === selectedCourseForDetails?.id}
      />
    </div>
  );
}
