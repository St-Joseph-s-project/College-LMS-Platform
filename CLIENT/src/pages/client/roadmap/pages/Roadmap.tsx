import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map, ChevronRight, Search, BookOpen, Clock, Lock } from "lucide-react";
import { getAllRoadmaps } from "../api/roadmapApi";
import type { Roadmap } from "../types/roadmap";


export default function RoadMap() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await getAllRoadmaps();
      setRoadmaps(response.data);
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);

    } finally {
      setLoading(false);
    }
  };

  const filteredRoadmaps = roadmaps.filter((roadmap) =>
    roadmap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    roadmap.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Map className="text-indigo-600" size={32} />
            Learning Roadmaps
          </h1>
          <p className="text-gray-500 mt-2">
            Choose your path and start your learning journey today.
          </p>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search roadmaps..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Section */}
      {filteredRoadmaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              onClick={() => {
                if (roadmap.can_view) {
                  navigate(`/dashboard/student/roadmap/all-course/${roadmap.id}`);
                }
              }}
              className={`group relative bg-white rounded-2xl border p-6 transition-all overflow-hidden ${roadmap.can_view
                ? "border-gray-100 hover:shadow-xl hover:border-indigo-100 cursor-pointer"
                : "border-gray-100 opacity-80 cursor-not-allowed grayscale-[0.5]"
                }`}
            >
              {/* Decorative Background Element */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />

              {!roadmap.can_view && (
                <div className="absolute top-4 right-4 z-20 bg-gray-900/10 backdrop-blur-sm p-2 rounded-lg text-gray-600">
                  <Lock size={16} />
                </div>
              )}

              <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform ${roadmap.can_view
                  ? "bg-indigo-50 text-indigo-600 group-hover:scale-110"
                  : "bg-gray-100 text-gray-400"
                  }`}>
                  <BookOpen size={24} />
                </div>

                <h3 className={`text-xl font-bold mb-2 transition-colors ${roadmap.can_view ? "text-gray-900 group-hover:text-indigo-600" : "text-gray-500"
                  }`}>
                  {roadmap.name}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                  {roadmap.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4 text-gray-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(roadmap.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {roadmap.can_view ? (
                    <div className="flex items-center gap-1 text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      View Path
                      <ChevronRight size={16} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400 font-semibold text-sm">
                      Locked
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Map className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No roadmaps found</h3>
          <p className="text-gray-500">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}