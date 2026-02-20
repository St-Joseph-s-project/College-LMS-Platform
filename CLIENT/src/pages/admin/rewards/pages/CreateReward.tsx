import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Trash2, Pencil, Search, Filter, Loader, Gift } from "lucide-react";
import { getAllRewards, deleteReward } from "../api/rewardApi";
import type { Reward } from "../types/reward";
import RewardModal from "../components/rewardModal";

const getImageUrl = (url: string) => {
  if (!url) return "/placeholder-image.png";
  if (url.startsWith("http") || url.startsWith("blob") || url.startsWith("data:")) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  return `${baseUrl}${url}`;
};

const CreateReward = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchRewards();
  }, []);



  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await getAllRewards();
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
    setEditingReward(reward);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReward(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this reward?")) {
      try {
        await deleteReward(id);
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
    <div className="space-y-8 animate-fadeIn w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Reward Management
            </h1>
            <p className="text-[var(--text-secondary)] max-w-2xl text-base leading-relaxed">
              Curate and organize student redemption items
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 font-medium whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--border-color)] my-6"></div>

      {/* Control Bar */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search rewards by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-[var(--text-primary)]"
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-lg text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800 transition-all shadow-sm text-sm font-medium">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4">
            <Loader className="animate-spin text-blue-600" size={32} />
            <p className="text-[var(--text-secondary)] font-medium text-sm">Syncing with Reward Vault...</p>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4 text-gray-400">
              <Gift size={32} />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Rewards Found</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-sm mb-6">
              Start by creating your first reward item for the student store.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              + Create One Now
            </button>
          </div>
        ) : (
          filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="group bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md flex flex-col"
            >
              {/* Image Section */}
              <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800 relative">
                <img
                  src={getImageUrl(reward.image_url)}
                  alt={reward.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Cost Badge */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[var(--text-primary)] dark:text-white text-xs font-bold border border-[var(--border-color)] shadow-sm">
                  {reward.coins} Coins
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1.5 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {reward.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                  {reward.description}
                </p>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 pt-4 border-t border-[var(--border-color)]">
                  <button
                    onClick={() => handleOpenModal(reward)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all text-sm font-medium"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Extracted Create/Edit Modal */}
      <RewardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reward={editingReward}
        onSuccess={fetchRewards}
      />
    </div>
  );
};

export default CreateReward;