import React, { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { createModule, updateModule } from "../api/moduleApi";
import type { Module } from "../types/module";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  courseId: number;
  onSuccess: () => void;
}

const ModuleModal: React.FC<ModuleModalProps> = ({
  isOpen,
  onClose,
  module,
  courseId,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (module) {
      setName(module.name);
      setDescription(module.description || "");
      setOrderIndex(module.order_index);
    } else {
      setName("");
      setDescription("");
      setOrderIndex(undefined);
    }
  }, [module, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (module) {
        await updateModule(module.id, {
          name,
          description,
          orderIndex,
        });
      } else {
        await createModule(courseId, {
          name,
          description,
          orderIndex
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to save module", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {module ? "Edit Module" : "Add New Module"}
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
              Module Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Introduction to React"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Brief description of the module..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Index
            </label>
            <input
              type="number"
              value={orderIndex || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setOrderIndex(isNaN(val) ? undefined : val);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. 1"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors min-w-[100px]"
            >
              {isLoading ? (
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              ) : null}
              {isLoading ? "Saving..." : module ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleModal;
