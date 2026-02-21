import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Map as MapIcon,
  Plus,
  Settings,
  Trash2,
  Edit,
  ChevronRight,
  Info,
  Layers,
  CheckCircle2,
  Clock
} from "lucide-react";
import {
  getRoadmapById,
  getRoadmapCourses,
  deleteRoadmap,
  removeCourseFromRoadmap
} from "../api/roadmapApi";
import type {
  Roadmap,
  RoadmapCourseMapping
} from "../types/roadMap";
import CourseMappingModal from "../components/CourseMappingModal";

export const RoadMapManage = () => {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [courses, setCourses] = useState<RoadmapCourseMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<RoadmapCourseMapping | null>(null);

  const fetchAllData = useCallback(async () => {
    if (!roadmapId) return;
    setIsLoading(true);

    try {
      const [roadmapRes, coursesRes] = await Promise.all([
        getRoadmapById(Number(roadmapId)),
        getRoadmapCourses(Number(roadmapId))
      ]);

      if (roadmapRes) setRoadmap(roadmapRes.data);
      if (coursesRes) setCourses(coursesRes.data);
    } catch (error) {
      console.error("Failed to fetch roadmap data", error);
    } finally {
      setIsLoading(false);
    }
  }, [roadmapId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddCourse = () => {
    setSelectedMapping(null);
    setIsModalOpen(true);
  };

  const handleEditMapping = (mapping: RoadmapCourseMapping) => {
    setSelectedMapping(mapping);
    setIsModalOpen(true);
  };



  const handleDeleteMapping = async (mappingId: number) => {
    if (window.confirm("Are you sure you want to remove this course from the roadmap?")) {
      try {
        const res = await removeCourseFromRoadmap(mappingId);
        if (res.status) {
          fetchAllData();
        }
      } catch (error) {
        console.error("Failed to remove course mapping", error);
      }
    }
  };

  const getCourseNameById = (id: number) => {
    const mapping = courses.find(c => c.lms_course.id === id);
    return mapping?.lms_course.name || `Course #${id}`;
  };

  if (isLoading && !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
        <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading roadmap details...</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Roadmap not found</h2>
        <button
          onClick={() => navigate("/dashboard/admin/roadmap/create")}
          className="mt-4 text-blue-600 hover:underline flex items-center gap-1 justify-center mx-auto"
        >
          <ArrowLeft size={16} /> Back to Roadmaps
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <button
          onClick={() => navigate("/dashboard/admin/roadmap")}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold text-sm w-fit group"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to Roadmaps
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-0"></div>

          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20">
                <MapIcon size={28} />
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${roadmap.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {roadmap.is_published ? 'Published' : 'Draft Mode'}
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">{roadmap.name}</h1>
            <p className="text-slate-500 max-w-2xl font-medium leading-relaxed italic">
              {roadmap.description || "No description provided for this roadmap."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Courses List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Learning Path</h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-black">
              {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
            </span>
          </div>

          <button
            onClick={handleAddCourse}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95 font-bold"
          >
            <Plus size={20} />
            Add Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center">
            <div className="p-5 bg-slate-50 rounded-full mb-6">
              <Layers className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your roadmap is empty</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">
              Start building the learning path by adding your first course to this roadmap.
            </p>
            <button
              onClick={handleAddCourse}
              className="mt-8 px-8 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-2xl transition-all font-black text-sm"
            >
              Add first course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {[...courses].sort((a, b) => a.order_index - b.order_index).map((mapping) => (
              <div
                key={mapping.id}
                className="group flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                {/* Index & Status */}
                <div className="flex md:flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl font-black text-xl shadow-lg shadow-slate-900/10 group-hover:bg-blue-600 transition-colors">
                    {mapping.order_index}
                  </div>
                  <div className="w-0.5 h-8 bg-slate-100 hidden md:block"></div>
                  <CheckCircle2 size={24} className="text-slate-200" />
                </div>

                {/* Course Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">Course</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {mapping.lms_course.name}
                  </h3>

                  {/* Dependencies Display */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {mapping.dependencies && mapping.dependencies.length > 0 ? (
                      <>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                          <Clock size={12} /> Prereq:
                        </span>
                        {mapping.dependencies.map(depId => (
                          <span
                            key={depId}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[11px] font-bold flex items-center gap-1"
                          >
                            {getCourseNameById(depId)}
                          </span>
                        ))}
                      </>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 italic flex items-center gap-1">
                        <Info size={12} /> No prerequisites (Start code available)
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                  <button
                    onClick={() => handleEditMapping(mapping)}
                    className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"
                    title="Edit Course Mapping"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteMapping(mapping.id)}
                    className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all"
                    title="Remove from Roadmap"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="p-3 text-slate-300">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}

      <CourseMappingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roadmapId={Number(roadmapId)}
        mapping={selectedMapping}
        onSuccess={fetchAllData}
      />
    </div>
  );
};