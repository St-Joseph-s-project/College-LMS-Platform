import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Upload, Search, Filter, Loader2 } from "lucide-react";
import { getApi, postApi, putApi, deleteApi } from "../../../../api/apiservice";

type Reward = {
  id: number;
  title: string;
  description: string;
  coins: number;
  image_url: string;
  image_key: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
};

const getImageUrl = (url: string) => {
  if (!url) return "/placeholder-image.png";
  if (url.startsWith("http") || url.startsWith("blob")) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  console.log("Image URL Debug:", { url, baseUrl, full: `${baseUrl}${url}` });
  return `${baseUrl}${url}`;
};

const CreateReward = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coins: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await getApi({ url: "/admin/rewards", showLoader: false });
      if (res && res.data) {
        setRewards(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch rewards", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (reward: Reward | null = null) => {
    if (reward) {
      setEditingReward(reward);
      setFormData({
        title: reward.title,
        description: reward.description,
        coins: reward.coins.toString(),
        image: null
      });
      setPreviewUrl(reward.image_url);
    } else {
      setEditingReward(null);
      setFormData({ title: "", description: "", coins: "", image: null });
      setPreviewUrl(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReward(null);
    setFormData({ title: "", description: "", coins: "", image: null });
    setPreviewUrl(null);
  };

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
      if (editingReward) {
        // Use putApi for updates
        // Since putApi sends JSON by default in apiservice.ts but here we need FormData,
        // we must check apiservice.ts implementation.
        // It uses `content-type` from props.customHeaders or application/json.
        // FormData usually requires 'multipart/form-data'.

        // Wait, apiservice calls: axios.put(`${props.url}`, props.data, { headers: ... })
        // If we pass formData, we should set customHeaders: "multipart/form-data".

        await putApi({
          url: `/admin/rewards/${editingReward.id}`,
          data: data,
          customHeaders: "multipart/form-data"
        });
      } else {
        await postApi({
          url: "/admin/rewards",
          data: data,
          customHeaders: "multipart/form-data"
        });
      }
      await fetchRewards();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save reward", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this reward?")) {
      try {
        await deleteApi({ url: `/admin/rewards/${id}` });
        fetchRewards();
      } catch (error) {
        console.error("Failed to delete reward", error);
      }
    }
  };

  const filteredRewards = rewards.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--glass-bg)] backdrop-blur-md p-6 rounded-2xl border border-[var(--glass-border)] shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]">
            Reward Management
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage and organize student rewards</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
        >
          <Plus size={20} />
          Add New Reward
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-[var(--glass-bg)] backdrop-blur-md p-4 rounded-xl border border-[var(--glass-border)] flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-muted)] rounded-lg border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-[var(--text-primary)]"
          />
        </div>
        <button className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin text-[var(--accent)]" size={40} />
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="col-span-full text-center py-20 text-[var(--text-secondary)]">
            {loading ? "Loading..." : "No rewards found. Create one to get started!"}
          </div>
        ) : (
          filteredRewards.map((reward) => (
            <div key={reward.id} className="group bg-[var(--glass-bg)] backdrop-blur-md rounded-2xl border border-[var(--glass-border)] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
              {/* Image Section */}
              <div className="h-48 w-full overflow-hidden bg-[var(--bg-muted)] relative">
                <img
                  src={getImageUrl(reward.image_url)}
                  alt={reward.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20">
                  {reward.coins} Coins
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 truncate" title={reward.title}>{reward.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm line-clamp-2 h-10 mb-4">
                  {reward.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
                  <button
                    onClick={() => handleOpenModal(reward)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200 text-sm font-medium"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="flex items-center justify-center p-2 rounded-lg bg-red-50/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
                    title="Delete Reward"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--surface-color)] w-full max-w-lg rounded-2xl shadow-2xl border border-[var(--glass-border)] overflow-hidden animate-in zoom-in-95 duration-200" style={{ backgroundColor: 'var(--bg-color)' }}>
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-muted)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {editingReward ? "Edit Reward" : "Create New Reward"}
              </h2>
              <button onClick={handleCloseModal} className="text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-primary)]">Reward Image</label>
                <div className="relative h-48 rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-muted)] hover:border-[var(--accent)] transition-colors group cursor-pointer overflow-hidden flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {previewUrl ? (
                    <img src={getImageUrl(previewUrl)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                      <Upload size={32} className="mb-2" />
                      <span className="text-sm font-medium">Click to upload image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-muted)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all text-[var(--text-primary)]"
                    placeholder="e.g. Premium Notebook"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Coins Price</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.coins}
                      onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-muted)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all text-[var(--text-primary)]"
                      placeholder="e.g. 500"
                    />
                  </div>
                  {/* Placeholder for any other field if needed */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-muted)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all text-[var(--text-primary)] resize-none"
                    placeholder="Enter reward description..."
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 px-4 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white hover:shadow-lg hover:scale-[1.02] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (editingReward ? "Updating..." : "Creating...") : (editingReward ? "Update Reward" : "Create Reward")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReward;