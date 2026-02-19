import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Trash2, Edit2, X, Upload, Search, Filter, Loader2, Gift } from "lucide-react";
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
  const location = useLocation();

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

  useEffect(() => {
    if (location.pathname.endsWith("/create")) {
      handleOpenModal();
    }
  }, [location.pathname]);

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
<<<<<<< HEAD
    <div className="min-h-screen bg-[var(--background)] w-full p-6 space-y-8 animate-fadeIn text-[var(--text-primary)]">
      {/* Header Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8 rounded-xl border-gray-200/30 dark:border-white/5 shadow-lg">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] dark:text-white">
            Reward <span className="text-[var(--accent)]">Management</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium flex items-center gap-2 opacity-80">
            <Gift size={16} className="text-[var(--accent)]" />
            Curate and organize student redemption items
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2.5 px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl shadow-lg shadow-[var(--accent)]/20 transform hover:-translate-y-0.5 transition-all duration-300 font-bold text-sm group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Reward
        </button>
      </div>

      {/* Control Bar */}
      <div className="w-full flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors duration-300">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search rewards by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-8 py-4 bg-white/20 dark:bg-black/10 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all duration-300 text-base font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
          />
        </div>

        <button className="flex items-center gap-2 px-6 py-4 bg-white/20 dark:bg-black/10 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 text-[var(--text-secondary)] hover:bg-[var(--accent)]/5 hover:text-[var(--accent)] transition-all duration-200 shadow-sm">
          <Filter size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">Filter</span>
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-[var(--accent)]" size={40} />
            <p className="text-[var(--text-secondary)] font-bold opacity-70 animate-pulse text-sm">Syncing with Reward Vault...</p>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="col-span-full glass-card rounded-xl py-24 text-center space-y-4 border-dashed border-2 border-gray-200 dark:border-white/5">
            <div className="w-16 h-16 bg-gray-50/50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 opacity-50">
              <Gift size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">No Rewards Found</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto font-medium opacity-70">Start by creating your first reward item for the student store.</p>
            <button onClick={() => handleOpenModal()} className="text-[var(--accent)] font-bold hover:underline text-sm transition-all">Create One Now</button>
          </div>
        ) : (
          filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="group glass-card rounded-xl border-none overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col relative"
            >
              {/* Image Section */}
              <div className="h-52 w-full overflow-hidden bg-gray-50/50 dark:bg-white/5 relative">
                <img
                  src={getImageUrl(reward.image_url)}
                  alt={reward.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Cost Badge */}
                <div className="absolute top-4 right-4 bg-white/20 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-bold border border-white/20 shadow-lg group-hover:bg-[var(--accent)] transition-colors duration-300">
                  <span className="flex items-center gap-1.5">
                    {reward.coins} <span className="opacity-70 tracking-widest uppercase">Coins</span>
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[var(--text-primary)] dark:text-white mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors duration-300 truncate">
                  {reward.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed line-clamp-2 mb-6 font-medium opacity-80">
                  {reward.description}
                </p>

                {/* Actions */}
                <div className="mt-auto flex gap-2 pt-5 border-t border-gray-100 dark:border-white/5">
                  <button
                    onClick={() => handleOpenModal(reward)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gray-50/50 dark:bg-white/5 text-[var(--text-primary)] dark:text-white/80 hover:bg-[var(--accent)] hover:text-white transition-all duration-200 text-xs font-bold"
                  >
                    <Edit2 size={14} />
                    Edit Item
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
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

      {/* Create/Edit Modal - Enhanced Glassmorphism */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md" onClick={handleCloseModal} />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/30 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  {editingReward ? <Edit2 size={18} /> : <Plus size={18} />}
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] dark:text-white">
                  {editingReward ? "Update Reward" : "New Reward Asset"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] px-1 uppercase tracking-widest opacity-60">Visual Assets</label>
                <div className="relative h-48 rounded-xl border-2 border-dashed border-gray-100 dark:border-white/10 bg-gray-50/30 dark:bg-white/2 hover:border-[var(--accent)] transition-all duration-300 flex flex-col items-center justify-center overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  {previewUrl ? (
                    <div className="relative w-full h-full group">
                      <img src={getImageUrl(previewUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-bold px-4 py-2 rounded-lg border border-white/30 bg-black/20 backdrop-blur-md text-xs">Change Asset</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 text-gray-400 opacity-60">
                      <Upload size={24} />
                      <div className="text-center">
                        <span className="block text-xs font-bold uppercase tracking-wider">Drag & Drop Image</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] px-1 uppercase tracking-widest opacity-60">Reward Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[var(--text-primary)] dark:text-white font-bold focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] outline-none transition-all duration-200 text-base"
                    placeholder="e.g. Premium Tech Bundle"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] px-1 uppercase tracking-widest opacity-60">Redemption Cost</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.coins}
                      onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                      className="w-full pl-5 pr-16 py-3 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[var(--text-primary)] dark:text-white font-bold focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] outline-none transition-all duration-200 text-base"
                      placeholder="0"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-[10px] text-amber-500 uppercase tracking-widest">Coins</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] px-1 uppercase tracking-widest opacity-60">Reward Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[var(--text-primary)] dark:text-white font-medium focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] outline-none transition-all duration-200 resize-none text-sm leading-relaxed"
                    placeholder="Provide a compelling description..."
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 text-[var(--text-secondary)] text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] py-3 bg-[var(--accent)] text-white rounded-lg font-bold text-sm shadow-lg shadow-[var(--accent)]/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Processing
                    </span>
                  ) : (
                    <span>{editingReward ? "Save Changes" : "Create Reward Item"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
=======
    <div className="w-full space-y-8">
      <h1 className="text-[length:var(--font-h1)] leading-[var(--font-h1--line-height)] font-black tracking-tight text-[var(--text-primary)]">Create Reward</h1>
      <p className="text-[length:var(--font-body)] text-[var(--text-secondary)]">Create new rewards for students</p>
>>>>>>> ashwin/lms_core
    </div>
  );
};

export default CreateReward;