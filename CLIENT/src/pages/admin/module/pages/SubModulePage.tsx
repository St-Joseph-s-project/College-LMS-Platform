import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, PlayCircle, FileText, CheckSquare, Plus, Pencil, Trash2 } from "lucide-react";
import { getSubModuleDetails, getAllSubModules, deleteSubModule } from "../api/subModuleApi";
import type { SubModuleDetailsResponse } from "../types/module";
import type { SubModule, SubModuleType } from "../types/subModule";
import SubModuleModal from "../components/SubModuleModal";
import SubModuleContentModal from "../components/SubModuleContentModal";

export const SubModulePage = () => {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<SubModuleDetailsResponse | null>(null);
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubModule, setSelectedSubModule] = useState<SubModule | null>(null);

  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedContentSubModule, setSelectedContentSubModule] = useState<SubModule | null>(null);

  useEffect(() => {
    fetchData();
  }, [courseId, moduleId]);

  const fetchData = async () => {
    if (!courseId || !moduleId) return;

    try {

      const [detailsRes, listRes] = await Promise.all([
        getSubModuleDetails(Number(courseId), Number(moduleId)),
        getAllSubModules(Number(courseId), Number(moduleId))
      ]);

      if (detailsRes.data) {
        setDetails(detailsRes.data);
      }

      if (listRes.data) {
        setSubModules(listRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);

    }
  };

  const handleSubModuleSuccess = async () => {
    if (!courseId || !moduleId) return;
    try {
      // Refresh only the list
      const listRes = await getAllSubModules(Number(courseId), Number(moduleId));
      if (listRes.data) {
        setSubModules(listRes.data);
      }
    } catch (err) {
      console.error("Failed to refresh list", err);
    }
  };

  const handleEdit = (subModule: SubModule) => {
    setSelectedSubModule(subModule);
    setIsModalOpen(true);
  };

  const handleOpenContent = (subModule: SubModule) => {
    setSelectedContentSubModule(subModule);
    setIsContentModalOpen(true);
  };

  const handleDelete = async (subModuleId: number) => {
    if (window.confirm("Are you sure you want to delete this sub-module?")) {
      try {
        await deleteSubModule(subModuleId);
        handleSubModuleSuccess();
      } catch (err) {
        console.error("Failed to delete sub-module", err);
      }
    }
  };

  const handleNavigateToCourse = () => {
    if (courseId) {
      navigate(`/dashboard/admin/module/create/${courseId}`);
    }
  };

  const getTypeIcon = (type: SubModuleType) => {
    switch (type) {
      case 'YT': return <PlayCircle size={20} className="text-red-500" />;
      case 'TEST': return <CheckSquare size={20} className="text-green-500" />;
      case 'CONTENT': return <FileText size={20} className="text-blue-500" />;
      default: return <FileText size={20} className="text-gray-500" />;
    }
  };

  const getTypeColor = (type: SubModuleType) => {
    switch (type) {
      case 'YT': return "bg-red-100 text-red-700 border-red-200";
      case 'TEST': return "bg-green-100 text-green-700 border-green-200";
      case 'CONTENT': return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };




  return (
    <div className="space-y-8 animate-fadeIn w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Header */}
      <div className="flex flex-col gap-6">
        <nav className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
          <span
            onClick={handleNavigateToCourse}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer hover:underline"
          >
            {details?.course.name}
          </span>
          <ChevronRight size={16} className="mx-2 text-gray-400" />
          <span className="text-[var(--accent)]" aria-current="page">
            {details?.module.name}
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                {details?.module.name}
              </h1>
              <span className={`px - 2.5 py - 0.5 rounded - full text - xs font - semibold ring - 1 ring - inset ${details?.module.is_published
                ? "bg-green-50 text-green-700 ring-green-600/20"
                : "bg-gray-50 text-gray-600 ring-gray-500/10"
                } `}>
                {details?.module.is_published ? "Published" : "Draft"}
              </span>
            </div>
            {details?.module.description && (
              <p className="text-[var(--text-secondary)] max-w-2xl text-base leading-relaxed">
                {details.module.description}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedSubModule(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 font-medium whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Add Submodule</span>
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--border-color)] my-6"></div>

      {/* Sub-Modules List */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
        {subModules.length > 0 ? (
          <div className="space-y-3">
            {subModules.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl p-5 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-sm flex gap-5 items-start"
              >
                <div className={`p - 3 rounded - lg flex - shrink - 0 transition - colors ${item.type === 'YT' ? "bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400" :
                  item.type === 'TEST' ? "bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400" :
                    "bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400"
                  } `}>
                  {getTypeIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`text - [10px] font - bold px - 2 py - 0.5 rounded border uppercase tracking - wider ${getTypeColor(item.type)} `}>
                      {item.type}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenContent(item)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium border border-transparent hover:border-blue-200"
                    title="Open Content"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-16 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] bg-gray-50/50 dark:bg-white/5">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4 text-gray-400">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No content yet</h3>
            <p className="text-[var(--text-secondary)] text-center max-w-sm mb-6">
              This module is currently empty. Start by adding videos, content, or tests to build your course.
            </p>
            <button
              onClick={() => {
                setSelectedSubModule(null);
                setIsModalOpen(true);
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              + Create your first sub-module
            </button>
          </div>
        )}
      </div>

      <SubModuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={Number(courseId)}
        moduleId={Number(moduleId)}
        onSuccess={handleSubModuleSuccess}
        subModule={selectedSubModule}
      />

      {selectedContentSubModule && (
        <SubModuleContentModal
          isOpen={isContentModalOpen}
          onClose={() => setIsContentModalOpen(false)}
          subModuleId={selectedContentSubModule.id}
          subModuleType={selectedContentSubModule.type}
          subModuleName={selectedContentSubModule.name}
        />
      )}
    </div>
  );
};
