
import React, { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { createSubModule, updateSubModule } from "../api/subModuleApi";
import type { SubModuleType, SubModule } from "../types/subModule";

interface SubModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  moduleId: number;
  onSuccess: () => void;
  subModule?: SubModule | null;
}

const SubModuleModal: React.FC<SubModuleModalProps> = ({
  isOpen,
  onClose,
  courseId,
  moduleId,
  onSuccess,
  subModule,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SubModuleType>("CONTENT");
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (subModule) {
        setTitle(subModule.name);
        setDescription(subModule.description || "");
        setType(subModule.type);
        setOrderIndex(subModule.order_index || 0);
      } else {
        setTitle("");
        setDescription("");
        setType("CONTENT");
        setOrderIndex(0);
      }
    }
  }, [isOpen, subModule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsLoading(true);
    try {
      if (subModule) {
        await updateSubModule(subModule.id, {
          title,
          description,
          type,
          orderIndex,
        });
      } else {
        await createSubModule(courseId, moduleId, {
          title,
          description,
          type,
          orderIndex,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save sub-module", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {subModule ? "Edit Sub-Module" : "Add New Sub-Module"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Introduction Video"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Brief description of the content..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SubModuleType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="CONTENT">CONTENT</option>
                <option value="YT">YT</option>
                <option value="TEST">TEST</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Index
              </label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
            >
              {isLoading ? (
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              ) : null}
              {subModule ? (isLoading ? "Saving..." : "Save Changes") : (isLoading ? "Creating..." : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubModuleModal;
