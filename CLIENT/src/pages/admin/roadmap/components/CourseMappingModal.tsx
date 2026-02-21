import { useState, useEffect } from "react";
import { X, Save, BookOpen, Layers, Plus, Hash, ListTree } from "lucide-react";
import {
  getAvailableCoursesDropdown,
  getRoadmapCoursesDropdown,
  addCourseToRoadmap,
  updateCourseMapping
} from "../api/roadmapApi";
import type {
  RoadmapCourseMapping,
  RoadmapCourseDropdown,
  AddCourseToRoadmapRequest,
  UpdateCourseMappingRequest
} from "../types/roadMap";

interface CourseMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapId: number;
  mapping: RoadmapCourseMapping | null;
  onSuccess: () => void;
}

const CourseMappingModal = ({
  isOpen,
  onClose,
  roadmapId,
  mapping,
  onSuccess
}: CourseMappingModalProps) => {
  const [availableCourses, setAvailableCourses] = useState<RoadmapCourseDropdown[]>([]);
  const [dependencyOptions, setDependencyOptions] = useState<RoadmapCourseDropdown[]>([]);

  const [formData, setFormData] = useState({
    course_id: 0,
    order_index: 0,
    parent_course_ids: [] as number[],
  });

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
      if (mapping) {
        setFormData({
          course_id: mapping.course_id,
          order_index: mapping.order_index,
          parent_course_ids: mapping.dependencies || [],
        });
      } else {
        setFormData({
          course_id: 0,
          order_index: 0,
          parent_course_ids: [],
        });
      }
    }
  }, [isOpen, mapping, roadmapId]);

  const fetchDropdownData = async () => {
    try {
      const [availableRes, dependencyRes] = await Promise.all([
        getAvailableCoursesDropdown(roadmapId),
        getRoadmapCoursesDropdown(roadmapId),
      ]);

      if (availableRes && availableRes.data) setAvailableCourses(availableRes.data);
      if (dependencyRes && dependencyRes.data) {
        const filtered = mapping
          ? dependencyRes.data.filter(c => c.id !== mapping.course_id)
          : dependencyRes.data;
        setDependencyOptions(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mapping) {
        const request: UpdateCourseMappingRequest = {
          order_index: formData.order_index,
          parent_course_ids: formData.parent_course_ids,
        };
        await updateCourseMapping(mapping.id, request);
        onSuccess();
        onClose();
      } else {
        if (formData.course_id === 0) return;
        const request: AddCourseToRoadmapRequest = {
          roadmap_id: roadmapId,
          course_id: formData.course_id,
          order_index: formData.order_index,
          parent_course_ids: formData.parent_course_ids,
        };
        await addCourseToRoadmap(request);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error("Error saving mapping", err);
    }
  };

  const toggleDependency = (courseId: number) => {
    setFormData(prev => ({
      ...prev,
      parent_course_ids: prev.parent_course_ids.includes(courseId)
        ? prev.parent_course_ids.filter(id => id !== courseId)
        : [...prev.parent_course_ids, courseId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 items-center">
      <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="p-8 pb-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Layers size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {mapping ? "Update Mapping" : "Map New Course"}
                </h2>
                <p className="text-slate-500 text-sm font-medium italic">Define the sequence and prerequisites</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all rounded-xl"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-6">
            {/* Course Selection or Display */}
            {!mapping ? (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  <BookOpen size={14} /> Knowledge Core
                </label>
                <div className="relative">
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: Number(e.target.value) })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer pr-12"
                  >
                    <option value={0}>Choose a course...</option>
                    {availableCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 p-6 rounded-[32px] flex items-center gap-5 group border-2 border-slate-800">
                <div className="p-3 bg-white/10 text-white rounded-2xl backdrop-blur-md">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black text-lg group-hover:text-blue-400 transition-colors uppercase tracking-tight">{mapping.lms_course.name}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Locked for modification</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order Index */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  <Hash size={14} /> Order Rank
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-black placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  placeholder="Index (e.g. 1)"
                />
              </div>

              {/* Prerequisites Label */}
              <div className="md:flex md:flex-col md:justify-end">
                <p className="text-[10px] font-medium text-slate-400 leading-tight italic px-1 mb-2">
                  Lower indices appear first in the student's journey.
                </p>
              </div>
            </div>

            {/* Dependencies */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                <ListTree size={14} /> Learning Prerequisites
              </label>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-[32px] max-h-52 overflow-y-auto custom-scrollbar shadow-inner">
                {dependencyOptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                      <ListTree size={18} className="text-slate-300" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No other courses available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {dependencyOptions.map(course => (
                      <label
                        key={course.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${formData.parent_course_ids.includes(course.id)
                          ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                          : 'bg-white border-slate-100 text-slate-600 hover:border-blue-300'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg transition-colors ${formData.parent_course_ids.includes(course.id) ? 'bg-white/10' : 'bg-slate-50'}`}>
                            <BookOpen size={16} />
                          </div>
                          <span className="text-sm font-black tracking-tight">{course.name}</span>
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={formData.parent_course_ids.includes(course.id)}
                          onChange={() => toggleDependency(course.id)}
                        />
                        <div className={`w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-all ${formData.parent_course_ids.includes(course.id)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-slate-100 border-slate-200 group-hover:border-blue-300'
                          }`}>
                          {formData.parent_course_ids.includes(course.id) && <Plus size={14} strokeWidth={4} />}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-500 hover:text-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 font-black text-sm uppercase tracking-widest"
            >
              <Save size={18} />
              <span>{mapping ? "Update Mapping" : "Lock in Mapping"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseMappingModal;
