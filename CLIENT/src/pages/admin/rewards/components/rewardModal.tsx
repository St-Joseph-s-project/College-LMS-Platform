import React, { useState, useEffect } from "react";
import { X, Upload, Loader } from "lucide-react";
import { createReward, updateReward } from "../api/rewardApi";
import type { Reward } from "../types/reward";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: Reward | null;
  onSuccess: () => void;
}

const getImageUrl = (url: string) => {
  if (!url) return "/placeholder-image.png";
  if (url.startsWith("http") || url.startsWith("blob") || url.startsWith("data:")) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  return `${baseUrl}${url}`;
};

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, reward, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coins: "",
    image: null as File | null,
  });

  useEffect(() => {
    if (reward) {
      setFormData({
        title: reward.title,
        description: reward.description,
        coins: reward.coins.toString(),
        image: null
      });
      setPreviewUrl(reward.image_url);
    } else {
      setFormData({ title: "", description: "", coins: "", image: null });
      setPreviewUrl(null);
    }
  }, [reward, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("coins", formData.coins);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (reward) {
        await updateReward(reward.id, data);
      } else {
        await createReward(data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save reward", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-[var(--border-color)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {reward ? "Update Reward" : "New Reward"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload Area */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Image</label>
            <div className="relative h-40 rounded-lg border-2 border-dashed border-[var(--border-color)] hover:border-blue-500 bg-gray-50 dark:bg-white/5 transition-all text-center flex flex-col items-center justify-center overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {previewUrl ? (
                <div className="w-full h-full">
                  <img src={getImageUrl(previewUrl)} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white text-sm font-medium px-3 py-1.5 rounded-md bg-black/50">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-gray-400">
                  <Upload size={24} />
                  <span className="text-sm font-medium">Click or drag image to upload</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                placeholder="Premium Notebook"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Cost (Coins)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.coins}
                onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                placeholder="100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-[var(--border-color)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                placeholder="Provide a detailed description..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader className="animate-spin" size={16} />}
              {reward ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RewardModal;
