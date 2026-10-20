// src/components/CourseDetailsModal.jsx

export default function CourseDetailsModal({
  isOpen,
  onClose,
  course,
  isTeacher,
  onEnroll,
  enrolling,
}) {
  if (!isOpen || !course) return null;

  const enrolledCount =
    course.enrolledCount ?? course.enrolledStudents?.length ?? 0;
  const maxStudents = course.maxStudents || 0;
  const availableSeats = Math.max(0, maxStudents - enrolledCount);
  const isEnrolled = course.isEnrolled;
  const isOpenStatus = course.status === "Open";

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Close":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Cancel":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">Course Details</h2>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                course.status,
              )}`}
            >
              {course.status}
            </span>
          </div>
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Info */}
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {course.courseName}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Instructor:{" "}
              <span className="font-semibold text-slate-700">
                {course.teacherName}
              </span>{" "}
              {course.teacherEmail && (
                <span className="text-slate-400">({course.teacherEmail})</span>
              )}
            </p>
          </div>

          {/* Key Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Duration
              </span>
              <div className="text-lg font-black text-slate-800 mt-0.5">
                {course.duration} days
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Price
              </span>
              <div className="text-lg font-black text-indigo-600 mt-0.5">
                ${course.price}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Enrolled
              </span>
              <div className="text-lg font-black text-slate-800 mt-0.5">
                {enrolledCount} / {maxStudents}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Seats Left
              </span>
              <div
                className={`text-lg font-black mt-0.5 ${
                  availableSeats > 0 ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {availableSeats}
              </div>
            </div>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Topics Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(course.topics) && course.topics.length > 0 ? (
                course.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100"
                  >
                    #{topic}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None specified</span>
              )}
            </div>
          </div>

          {/* Enrolled Students Table - TEACHER ONLY */}
          {isTeacher && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Enrolled Students ({enrolledCount})
                </h3>
                {enrolledCount === 0 && (
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Eligible for Deletion (0 enrolled)
                  </span>
                )}
              </div>

              {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="px-4 py-2.5">#</th>
                        <th className="px-4 py-2.5">Username</th>
                        <th className="px-4 py-2.5">Email</th>
                        <th className="px-4 py-2.5">Enrolled Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {course.enrolledStudents.map((student, idx) => (
                        <tr key={student.studentId || idx} className="hover:bg-slate-50/70">
                          <td className="px-4 py-2 text-slate-400 font-medium">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-2 font-bold text-slate-800">
                            {student.username}
                          </td>
                          <td className="px-4 py-2 text-slate-600">
                            {student.email}
                          </td>
                          <td className="px-4 py-2 text-slate-400">
                            {student.enrolledAt
                              ? new Date(student.enrolledAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 border border-slate-100">
                  No students have enrolled in this course yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Close
          </button>

          {/* Student Enrollment action */}
          {!isTeacher && onEnroll && (
            <div>
              {isEnrolled ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-100 rounded-xl">
                  ✓ Already Enrolled
                </span>
              ) : !isOpenStatus ? (
                <span className="inline-flex items-center px-4 py-2 text-sm font-bold text-slate-400 bg-slate-100 rounded-xl">
                  Enrollment Closed
                </span>
              ) : availableSeats <= 0 ? (
                <span className="inline-flex items-center px-4 py-2 text-sm font-bold text-rose-500 bg-rose-50 rounded-xl border border-rose-200">
                  Class Full
                </span>
              ) : (
                <button
                  type="button"
                  disabled={enrolling}
                  onClick={() => onEnroll(course.id)}
                  className="px-6 py-2 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  {enrolling ? "Enrolling..." : "Enroll in Course"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
