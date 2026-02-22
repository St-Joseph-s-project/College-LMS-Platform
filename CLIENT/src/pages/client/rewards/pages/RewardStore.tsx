import { useState, useEffect } from "react";
import { Search, Filter, Loader, Gift, ShoppingCart } from "lucide-react";
import { getAllRewards, purchaseReward } from "../api/rewardApi";
import type { Reward } from "../types/reward";

const getImageUrl = (url: string) => {
  if (!url) return "/placeholder-image.png";
  if (url.startsWith("http") || url.startsWith("blob") || url.startsWith("data:")) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  return `${baseUrl}${url}`;
};

const RewardStore = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [purchasingId, setPurchasingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {

    try {
      const res = await getAllRewards();
      if (res) {
        setRewards(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch rewards", error);
    }
  };

  const handlePurchase = async (id: number) => {
    if (!window.confirm("Are you sure you want to purchase this reward?")) return;

    setPurchasingId(id);
    try {
      await purchaseReward(id);
      // After purchase, we might want to refresh the user profile/coins as well
      // For now, just a confirmation Toast is handled by the api service
    } catch (err) {
      console.error("Purchase failed", err);
    } finally {
      setPurchasingId(null);
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
              Reward Store
            </h1>
            <p className="text-[var(--text-secondary)] max-w-2xl text-base leading-relaxed">
              Redeem your hard-earned coins for exciting rewards and perks
            </p>
          </div>
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
            placeholder="Search for rewards..."
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
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRewards.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4 text-gray-400">
              <Gift size={32} />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Rewards Available</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-sm">
              We'll have new rewards for you soon. Keep learning and earning coins!
            </p>
          </div>
        ) : (
          filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="group bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800 relative">
                <img
                  src={getImageUrl(reward.image_url)}
                  alt={reward.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {reward.coins} Coins
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {reward.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                  {reward.description}
                </p>

                <button
                  onClick={() => handlePurchase(reward.id)}
                  disabled={purchasingId === reward.id}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-all font-semibold shadow-md active:scale-[0.98]"
                >
                  {purchasingId === reward.id ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={18} />
                  )}
                  <span>Redeem Now</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RewardStore;
