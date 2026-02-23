import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Monitor,
  MessageSquare,
  Youtube,
  GraduationCap,
  Clock,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle
} from "lucide-react";
import { getCourseModules, getModuleDetails, markSubmoduleComplete } from "../api/courseApi";
import type { Module, ModuleDetail, Submodule } from "../types/roadmap";

export default function Course() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleDetail, setCurrentModuleDetail] = useState<ModuleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const moduleId = searchParams.get("moduleId");
  const submoduleId = searchParams.get("submoduleId");

  // Fetch initial module list for sidebar
  useEffect(() => {
    if (courseId) {
      fetchSidebarModules(parseInt(courseId));
    }
  }, [courseId]);

  // Handle default selection and module detail fetching
  useEffect(() => {
    if (modules.length > 0) {
      if (!moduleId) {
        const firstModule = modules[0];
        const firstSubmodule = firstModule.lms_submodule?.[0];
        if (firstModule && firstSubmodule) {
          setSearchParams({
            moduleId: firstModule.id.toString(),
            submoduleId: firstSubmodule.id.toString()
          });
        }
      } else {
        fetchModuleDetails(parseInt(moduleId));
        // Ensure module is expanded in sidebar
        setExpandedModules(prev => ({ ...prev, [parseInt(moduleId)]: true }));
      }
    }
  }, [modules, moduleId]);

  const fetchSidebarModules = async (id: number) => {
    try {
      setLoading(true);
      const response = await getCourseModules(id);
      setModules(response.data || []);
    } catch (error) {
      console.error("Failed to fetch sidebar modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleDetails = async (id: number) => {
    try {
      setDetailLoading(true);
      const response = await getModuleDetails(id);
      setCurrentModuleDetail(response.data);
    } catch (error) {
      console.error("Failed to fetch module details:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleModule = (mId: number) => {
    setExpandedModules(prev => ({ ...prev, [mId]: !prev[mId] }));
  };

  const currentSubmodule = currentModuleDetail?.lms_submodule.find(
    s => s.id.toString() === submoduleId
  );

  const handleSubmoduleClick = (mId: number, sId: number) => {
    setSearchParams({ moduleId: mId.toString(), submoduleId: sId.toString() });
  };

  const handleCompleteAndNext = async () => {
    if (!submoduleId) return;

    try {
      setIsMarkingComplete(true);
      await markSubmoduleComplete(parseInt(submoduleId));
      // Optionally update local state or progress here if needed
      goToNextLesson();
    } catch (error) {
      console.error("Failed to mark submodule complete:", error);
      // Still go to next lesson even if API fails, or show error?
      // Usually better to proceed but log the error.
      goToNextLesson();
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const goToNextLesson = () => {
    // Flatten all submodules into a single list with their module IDs
    const flattened = modules.flatMap((m: Module) =>
      (m.lms_submodule || []).map((s: Submodule) => ({ moduleId: m.id, submoduleId: s.id }))
    );

    const currentIndex = flattened.findIndex((f: { moduleId: number; submoduleId: number }) => f.submoduleId.toString() === submoduleId);

    if (currentIndex !== -1 && currentIndex < flattened.length - 1) {
      const next = flattened[currentIndex + 1];
      setSearchParams({
        moduleId: next.moduleId.toString(),
        submoduleId: next.submoduleId.toString()
      });
    } else {
      // Potentially end of course or back to roadmap
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading course content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-[#f8fafc] w-full overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]">
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full pb-24">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-all group bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold text-sm">Back to Path</span>
            </button>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:flex hidden items-center gap-2 text-gray-500 hover:text-indigo-600 transition-all bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
              title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
              <span className="font-semibold text-sm">{isSidebarOpen ? "Hide Index" : "Show Index"}</span>
            </button>
          </div>

          {detailLoading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-full aspect-video bg-gray-200 rounded-3xl mb-8" />
              <div className="h-8 bg-gray-200 w-3/4 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 w-1/2 rounded-lg" />
            </div>
          ) : currentSubmodule ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Common Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-indigo-100">
                    {currentSubmodule.type}
                  </span>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-500 text-xs font-semibold">{currentModuleDetail?.name}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                  {currentSubmodule.name}
                </h1>

                {currentSubmodule.type !== "TEST" && (
                  <div className="prose prose-indigo max-w-none text-gray-600 text-lg leading-relaxed">
                    {currentModuleDetail?.description}
                  </div>
                )}
              </div>

              {/* Media Section */}
              {currentSubmodule.type === "YT" && currentSubmodule.video_url && (
                <div className="bg-black rounded-3xl aspect-video w-full mb-8 shadow-2xl relative overflow-hidden group">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(currentSubmodule.video_url)}`}
                    className="w-full h-full"
                    allowFullScreen
                    title={currentSubmodule.name}
                  />
                </div>
              )}

              {currentSubmodule.type === "CONTENT" ? (
                <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 min-h-[400px]">
                  <div className="prose prose-indigo max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-headings:text-gray-900">
                    <div dangerouslySetInnerHTML={{ __html: currentSubmodule.content || "" }} />
                  </div>
                </div>
              ) : currentSubmodule.type === "TEST" ? (
                <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-1">Assessment</h2>
                      <p className="text-sm text-gray-500 font-medium">Knowledge Check • {currentSubmodule.lms_submodule_question.length} Questions</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {currentSubmodule.lms_submodule_question.map((q, idx) => (
                      <div key={q.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="font-bold text-gray-900 mb-4 flex gap-3 text-lg">
                          <span className="text-indigo-600 tabular-nums">{idx + 1}.</span>
                          {q.question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.lms_question_options.map((opt) => (
                            <button
                              key={opt.id}
                              className="p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-sm font-medium text-gray-700 flex items-center justify-between group shadow-sm"
                            >
                              {opt.option_text}
                              <div className="w-5 h-5 rounded-full border border-gray-200 group-hover:border-indigo-400 bg-white" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95">
                      Submit Assessment
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Navigation Footer */}
              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Continue your journey</h3>
                  <p className="text-indigo-100 font-medium">Ready to take on the next challenge?</p>
                </div>
                <button
                  onClick={handleCompleteAndNext}
                  disabled={isMarkingComplete}
                  className="relative z-10 px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isMarkingComplete ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                  ) : (
                    <CheckCircle size={20} />
                  )}
                  Complete & Next
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
              <Monitor size={64} className="mb-6 opacity-20" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No lesson selected</h3>
              <p className="text-sm">Choose a module from the sidebar to begin learning.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Sticky and independent scrolling */}
      <div className={`
        ${isSidebarOpen ? "w-full lg:w-[400px] border-l" : "w-0 overflow-hidden border-0"}
        bg-white border-gray-100 flex flex-col shrink-0 shadow-2xl relative z-10 h-full transition-all duration-300 ease-in-out
      `}>
        <div className="p-8 border-b border-gray-50 flex-shrink-0 min-w-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">Step-by-Step Guide</h2>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              <span>Course Progress</span>
              <span>33%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
              <div className="w-1/3 h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
          {modules.map((mod) => (
            <div key={mod.id} className="border-b border-gray-50 last:border-0">
              <button
                onClick={() => toggleModule(mod.id)}
                className={`w-full p-6 flex items-center justify-between transition-all text-left ${expandedModules[mod.id] ? "bg-indigo-50/20" : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex gap-4 items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${expandedModules[mod.id] ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-100 text-gray-500"
                    }`}>
                    {mod.order_index}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Module {mod.order_index}</span>
                    <span className={`font-bold text-sm leading-tight transition-colors ${expandedModules[mod.id] ? "text-indigo-950" : "text-gray-700"}`}>
                      {mod.name}
                    </span>
                  </div>
                </div>
                {expandedModules[mod.id] ? <ChevronDown size={18} className="text-indigo-600" /> : <ChevronRight size={18} className="text-gray-400" />}
              </button>

              {expandedModules[mod.id] && (
                <div className="bg-[#fafbfc] border-y border-gray-50 divide-y divide-gray-50/50">
                  {(mod.lms_submodule || []).sort((a, b) => a.order_index - b.order_index).map((sub) => {
                    const isActive = sub.id.toString() === submoduleId;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubmoduleClick(mod.id, sub.id)}
                        className={`w-full p-5 flex items-center gap-4 transition-all text-left group relative ${isActive ? "bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] translate-x-1" : "hover:bg-indigo-50/30"
                          }`}
                      >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />}
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${isActive
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600 scale-105"
                          : "bg-white border-gray-100 text-gray-400 group-hover:border-indigo-100 group-hover:text-indigo-400"
                          }`}>
                          {getContentIcon(sub.type, isActive)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className={`text-xs font-bold truncate transition-colors ${isActive ? "text-indigo-600" : "text-gray-600 group-hover:text-indigo-500"}`}>
                            {sub.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock size={10} className="text-gray-300" />
                            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">
                              {sub.type === "YT" ? "Video Content" : sub.type === "TEST" ? "Assessment" : "Reading Content"}
                            </p>
                          </div>
                        </div>
                        {isActive ? (
                          <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                            <Play size={10} fill="currentColor" />
                          </div>
                        ) : (
                          <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>


      </div>
    </div>
  );
}

// Helpers
function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getContentIcon(type: string, _active: boolean) {
  const size = 16;
  switch (type) {
    case "YT": return <Youtube size={size} />;
    case "TEST": return <CheckCircle2 size={size} />;
    default: return <FileText size={size} />;
  }
}