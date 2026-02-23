import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { getRoadmaps, deleteRoadmap, updateRoadmapStatus } from "../api/roadmapApi";
import type { Roadmap } from "../types/roadMap";
import RoadmapModal from "../components/RoadmapModal";
import { useNavigate } from "react-router-dom";

export const RoadMapCreate = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);

  const fetchRoadmaps = async () => {
    setIsLoading(true);
    try {
      const response = await getRoadmaps();
      if (response && response.data) {
        setRoadmaps(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch roadmaps", error);
      setRoadmaps([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleAddRoadmap = () => {
    setEditingRoadmap(null);
    setIsModalOpen(true);
  };

  const handleEditRoadmap = (roadmap: Roadmap) => {
    setEditingRoadmap(roadmap);
    setIsModalOpen(true);
  };

  const handleDeleteRoadmap = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this roadmap?")) {
      try {
        await deleteRoadmap(id);
        fetchRoadmaps();
      } catch (error) {
        console.error("Failed to delete roadmap", error);
      }
    }
  };

  const handleToggleStatus = async (roadmap: Roadmap) => {
    try {
      await updateRoadmapStatus(roadmap.id, { is_published: !roadmap.is_published });
      fetchRoadmaps();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleManageCourses = (roadmap: Roadmap) => {
    // Navigate to course mapping page (to be implemented)
    navigate(`/dashboard/admin/roadmap/manage/${roadmap.id}`);

  };

  const filteredRoadmaps = roadmaps.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={32} />
            Create Roadmap
          </h1>
          <p className="text-gray-500 mt-1">Design and manage learning pathways for students</p>
        </div>

        <button
          onClick={handleAddRoadmap}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
        >
          <Plus size={20} />
          <span className="font-semibold">Add Roadmap</span>
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search roadmaps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 glass-card rounded-2xl border-none">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading amazing roadmaps...</p>
        </div>
      ) : filteredRoadmaps.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-center">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <TrendingUp className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {searchQuery ? "No matching roadmaps" : "No roadmaps created yet"}
          </h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            {searchQuery
              ? `We couldn't find any roadmaps matching "${searchQuery}"`
              : "Start by creating a roadmap to guide your students through their learning journey."}
          </p>
          {!searchQuery && (
            <button
              onClick={handleAddRoadmap}
              className="mt-6 px-6 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all font-bold"
            >
              Create your first roadmap
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 rounded-t-2xl ${roadmap.is_published ? 'bg-green-500' : 'bg-gray-300'}`}></div>

              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${roadmap.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {roadmap.is_published ? 'Published' : 'Draft'}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditRoadmap(roadmap)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Roadmap"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteRoadmap(roadmap.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Roadmap"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{roadmap.name}</h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-6 min-h-[4.5rem]">
                {roadmap.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <button
                  onClick={() => handleToggleStatus(roadmap)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${roadmap.is_published
                    ? 'text-green-700 bg-green-50 hover:bg-green-100'
                    : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                  {roadmap.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                  {roadmap.is_published ? 'Live' : 'Hidden'}
                </button>

                <button
                  onClick={() => handleManageCourses(roadmap)}
                  className="flex items-center gap-1 text-blue-600 font-bold text-sm hover:gap-2 transition-all"
                >
                  Manage Courses
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <RoadmapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roadmap={editingRoadmap}
        onSuccess={fetchRoadmaps}
      />
    </div>
  );
};