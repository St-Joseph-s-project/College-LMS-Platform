
import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { getAllCourses, deleteCourse, updateCourseVisibility } from "../api/courseApi";
import type { Course } from "../types/course";
import CourseModal from "../components/CourseModal";

export const CreateCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    const response = await getAllCourses();
    if (response) {
      setCourses(response.data || []);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (error: any) {
        console.error("Failed to delete course", error);
      }
    }
  };

  const handleToggleVisibility = async (course: Course) => {
    const originalCourses = [...courses];
    const newStatus = !course.is_published;

    // Optimistic update
    setCourses(courses.map(c =>
      c.id === course.id ? { ...c, is_published: newStatus } : c
    ));

    try {
      await updateCourseVisibility(course.id, { is_published: newStatus });
      // Optionally fetch to sync with server, but optimistic update handles the UI
      // fetchCourses(); 
    } catch (error: any) {
      console.error("Failed to update visibility", error);
      // Revert on error
      setCourses(originalCourses);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="p-6 space-y-6 bg-gray-50 w-full h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <p className="text-gray-500 mt-1">Manage your course catalog</p>
        </div>
        <button
          onClick={handleAddCourse}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Add Course
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Course Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {course.name}
                      {course.description && (
                        <p className="text-xs text-gray-400 font-normal truncate max-w-xs mt-0.5">
                          {course.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {course.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(course.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleVisibility(course)}
                        className={`p-1.5 rounded-md transition-colors ${course.is_published
                          ? "text-orange-500 hover:bg-orange-50"
                          : "text-green-600 hover:bg-green-50"
                          }`}
                        title={course.is_published ? "Unpublish" : "Publish"}
                      >
                        {course.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    {searchTerm ? "No courses found matching your search." : "No courses added yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        onSuccess={fetchCourses}
      />
    </div>
  );
};


