import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Lock,
  CheckCircle2,
  Circle
} from "lucide-react";
import { getRoadmapById, getRoadmapCourses } from "../api/roadmapApi";
import type { RoadmapDetail, RoadmapCourse } from "../types/roadmap";

export default function AllCourse() {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const [roadmap, setRoadmap] = useState<RoadmapDetail | null>(null);
  const [courses, setCourses] = useState<RoadmapCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (roadmapId) {
      fetchData(parseInt(roadmapId));
    }
  }, [roadmapId]);

  const fetchData = async (id: number) => {
    try {
      setLoading(true);
      const [roadmapRes, coursesRes] = await Promise.all([
        getRoadmapById(id),
        getRoadmapCourses(id)
      ]);
      setRoadmap(roadmapRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error("Failed to fetch roadmap details:", error);

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-gray-900">Roadmap not found</h3>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-indigo-600 hover:underline flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto">
      {/* Back Button & Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Roadmaps
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{roadmap.name}</h1>
            <p className="text-gray-600 max-w-2xl">{roadmap.description}</p>
          </div>
        </div>

        <div className="flex gap-6 mt-8 pt-8 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Courses</span>
            <span className="text-xl font-bold text-gray-900">{courses.length}</span>
          </div>
          <div className="h-10 w-px bg-gray-100" />

        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          Course Track
          <span className="text-sm font-normal text-gray-400">({courses.length} steps)</span>
        </h2>

        <div className="relative">
          {/* Vertical Line for Timeline */}
          <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-100" />

          {courses.sort((a, b) => a.order_index - b.order_index).map((course, index) => {
            const isUnlocked = course.can_view;

            return (
              <div key={course.id} className="relative flex gap-6 mb-8 group">
                {/* Status Icon / Timeline Node */}
                <div className="relative z-10 w-14 h-14 flex items-center justify-center shrink-0">
                  {isUnlocked ? (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center border-4 border-white shadow-lg shadow-indigo-100">
                      {index + 1}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border-4 border-white">
                      <Lock size={16} />
                    </div>
                  )}
                </div>

                {/* Course Card */}
                <div
                  onClick={() => isUnlocked && navigate(`/dashboard/student/roadmap/course/${course.course_id}`)}
                  className={`flex-1 bg-white rounded-2xl border p-5 transition-all outline-none ${isUnlocked
                    ? "border-gray-100 hover:shadow-lg hover:border-indigo-100 cursor-pointer"
                    : "border-gray-50 opacity-75 grayscale bg-gray-50 cursor-not-allowed"
                    }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className={`font-bold mb-1 ${isUnlocked ? "text-gray-900" : "text-gray-500"}`}>
                        {course.lms_course.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {course.lms_course.description}
                      </p>

                      {!isUnlocked && (
                        <div className="flex items-center gap-2 mt-3 p-2 bg-amber-50 rounded-lg border border-amber-100 w-fit">
                          <Lock size={14} className="text-amber-600" />
                          <span className="text-[10px] font-bold text-amber-700 uppercase">
                            Locked - Complete prerequisites to unlock
                          </span>
                        </div>
                      )}
                    </div>

                    {isUnlocked && (
                      <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}