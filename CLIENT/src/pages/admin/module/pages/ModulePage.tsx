import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getCoursesDropdown } from "../../course/api/courseApi";
import { getModulesByCourseId, deleteModule, updateModuleVisibility } from "../api/moduleApi";
import type { Module } from "../types/module";
import ModuleModal from "../components/ModuleModal";

export const ModulePage = () => {
  const navigate = useNavigate();
  const { courseId: paramCourseId } = useParams();

  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<{ id: number; name: string } | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  // Fetch courses for dropdown
  const fetchCourses = async (query: string = "") => {
    try {
      const response = await getCoursesDropdown(query);
      if (response && response.data) {
        setCourses(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle URL param courseId
  useEffect(() => {
    if (paramCourseId) {
      const id = parseInt(paramCourseId);
      // We might need to fetch the specific course details if not in list, 
      // but for now let's try to find it in the loaded courses or just set ID
      // If the list is partial (search based), we might not have it. 
      // ideally we should fetch course by ID here, but for now relying on user selection or existing list
      const course = courses.find(c => c.id === id);
      if (course) {
        setSelectedCourse(course);
      }
    } else {
      setSelectedCourse(null);
      setSearchQuery("");
      setModules([]);
    }
  }, [paramCourseId, courses]);

  // Fetch modules when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchModules(selectedCourse.id);
    } else {
      setModules([]);
    }
  }, [selectedCourse]);

  const fetchModules = async (courseId: number) => {
    setIsLoading(true);
    try {
      const response = await getModulesByCourseId(courseId);
      // @ts-ignore - API response might be wrapped differently or purely data
      if (response && response.data) {
        // @ts-ignore
        setModules(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch modules", error);
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchCourses(query);
    setIsDropdownOpen(true);
  };

  const handleSelectCourse = (course: { id: number; name: string }) => {
    setSelectedCourse(course);
    setSearchQuery(course.name);
    setIsDropdownOpen(false);
    // Optionally update URL
    // navigate(\`/dashboard/admin/module/create/\${course.id}\`);
  };

  const handleAddModule = () => {
    setEditingModule(null);
    setIsModalOpen(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setIsModalOpen(true);
  };

  const handleDeleteModule = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        await deleteModule(id);
        if (selectedCourse) fetchModules(selectedCourse.id);
      } catch (error) {
        console.error("Failed to delete module", error);
      }
    }
  };

  const handleToggleVisibility = async (module: Module) => {
    try {
      await updateModuleVisibility(module.id, { isPublished: !module.is_published });
      if (selectedCourse) fetchModules(selectedCourse.id);
    } catch (error) {
      console.error("Failed to update visibility", error);
    }
  };

  const handleOpenModule = (module: Module) => {
    navigate(`/dashboard/admin/submodule/${selectedCourse?.id}/${module.id}`);
  };

  return (
    <div className="p-6  mx-auto space-y-6 w-full h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Module Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage course modules and content</p>
        </div>

        {/* Course Search Dropdown */}
        <div className="relative w-full md:w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a course..."
              value={searchQuery}
              onChange={handleCourseSearch}
              onFocus={() => setIsDropdownOpen(true)}
              // onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delayed close for click
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {courses.length > 0 ? (
                  courses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => handleSelectCourse(course)}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm"
                    >
                      {course.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm text-center">No courses found</div>
                )}
              </div>
            )}
          </div>
          {isDropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)}></div>}
        </div>
      </div>

      {!selectedCourse ? (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No Course Selected</h3>
          <p className="text-gray-500 mt-2 max-w-sm">Please search and select a course from the search bar above to view and manage its modules.</p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selectedCourse.name}</h2>
                <p className="text-xs text-gray-500">Course ID: {selectedCourse.id}</p>
              </div>
            </div>
            <button
              onClick={handleAddModule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={18} />
              <span>Add Module</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : modules.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm text-center">
              <div className="p-3 bg-gray-100 rounded-full mb-4">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No modules found</h3>
              <p className="text-gray-500 mt-1 mb-6">This course hasn't set up any modules yet.</p>
              <button
                onClick={handleAddModule}
                className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium"
              >
                Create your first module
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white p-5 rounded-xl text-left border border-gray-200 hover:shadow-md transition-shadow group relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${module.is_published ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                    <div className="flex-1 pl-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Order: {module.order_index}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${module.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {module.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{module.name}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {module.description || "No description provided."}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        {module.noSubModule !== undefined && (
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-gray-700">{module.noSubModule}</span> Submodules
                          </span>
                        )}
                        <span className="text-gray-300">|</span>
                        <span>Created: {module.created_at ? new Date(module.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <button
                        onClick={() => handleToggleVisibility(module)}
                        className={`p-2 rounded-lg transition-colors ${module.is_published
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                          }`}
                        title={module.is_published ? "Unpublish" : "Publish"}
                      >
                        {module.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleEditModule(module)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Module"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Module"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="w-px h-6 bg-gray-200 mx-1"></div>
                      <button
                        onClick={() => handleOpenModule(module)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Open
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedCourse && (
        <ModuleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          module={editingModule}
          courseId={selectedCourse.id}
          onSuccess={() => fetchModules(selectedCourse.id)}
        />
      )}
    </div>
  );
};