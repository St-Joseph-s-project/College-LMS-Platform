import React, { useState, useEffect } from "react";
import { X, Layout, Type, AlignLeft, Eye, EyeOff } from "lucide-react";
import ToggleSwitch from "../../../../components/ui/ToggleSwitch";
import { createRoadmap, updateRoadmap, updateRoadmapStatus } from "../api/roadmapApi";
import type { Roadmap } from "../types/roadMap";

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmap: Roadmap | null;
  onSuccess: () => void;
}

const RoadmapModal: React.FC<RoadmapModalProps> = ({
  isOpen,
  onClose,
  roadmap,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (roadmap) {
      setName(roadmap.name);
      setDescription(roadmap.description || "");
      setIsPublished(roadmap.is_published);
    } else {
      setName("");
      setDescription("");
      setIsPublished(false);
    }
  }, [roadmap, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (roadmap) {
        await updateRoadmap(roadmap.id, { name, description });
        if (roadmap.is_published !== isPublished) {
          await updateRoadmapStatus(roadmap.id, { is_published: isPublished });
        }
      } else {
        const response = await createRoadmap({ name, description });
        if (isPublished && response.data && response.data.id) {
          await updateRoadmapStatus(response.data.id, { is_published: true });
        }
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to save roadmap", error);
      // Even on error, if global handling is expected, 
      // the user might still want the modal to close or stay open.
      // Usually, it's safer to keep it open on error unless specified.
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Layout size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {roadmap ? "Refine Roadmap" : "Draft New Path"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">Configure your learning journey details</p>
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
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              <Type size={14} /> Roadmap Identity
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              placeholder="e.g. Frontend Mastery 2024"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              <AlignLeft size={14} /> The Vision
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
              placeholder="Describe the learning path and what students will achieve..."
            />
          </div>

          {/* Visibility Toggle */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl transition-colors ${isPublished ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                {isPublished ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm">Public Visibility</h4>
                <p className="text-xs font-medium text-slate-500">
                  {isPublished ? 'Visible to all students' : 'Only admins can see this draft'}
                </p>
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <ToggleSwitch
                checked={isPublished}
                onChange={setIsPublished}
              />
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
              {roadmap ? "Update Roadmap" : "Initialize Roadmap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoadmapModal;
