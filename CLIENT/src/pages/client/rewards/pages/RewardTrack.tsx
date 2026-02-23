import { useState, useEffect } from "react";
import { Search, Loader, Package, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getRewardHistory } from "../api/rewardApi";
import type { RewardHistory } from "../types/reward";

const getImageUrl = (url: string) => {
  if (!url) return "/placeholder-image.png";
  if (url.startsWith("http") || url.startsWith("blob") || url.startsWith("data:")) return url;
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
  return `${baseUrl}${url}`;
};

const RewardTrack = () => {
  const [history, setHistory] = useState<RewardHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getRewardHistory();
      if (res) {
        setHistory(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch reward history", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock size={16} />;
      case "APPROVED": return <Package size={16} />;
      case "DELIVERED": return <CheckCircle size={16} />;
      case "REJECTED": return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "APPROVED": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "DELIVERED": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "REJECTED": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const filteredHistory = history.filter(item =>
    item.rewards?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-8 animate-fadeIn w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              My Redemptions
            </h1>
            <p className="text-[var(--text-secondary)] max-w-2xl text-base leading-relaxed">
              Track the status of your purchased rewards and view your history
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
            placeholder="Search by ID or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-[var(--text-primary)]"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-[var(--border-color)] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Reward Item</th>
                <th className="px-6 py-4">Ordered Date</th>
                <th className="px-6 py-4">Status</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader className="animate-spin text-blue-600 mx-auto" size={24} />
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Fetching your history...</p>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <Clock size={24} />
                    </div>
                    <p className="text-[var(--text-primary)] font-medium">No redemptions yet</p>
                    <p className="text-sm text-gray-500 mt-1">Visit the store to redeem your first reward!</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-500">#{item.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={getImageUrl(item.rewards?.image_url)}
                            alt={item.rewards?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[var(--text-primary)]">{item.rewards?.title || 'Unknown Item'}</div>
                          <div className="text-xs text-blue-600 font-medium">{item.rewards?.coins || 0} Coins</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.ordered_date ? new Date(item.ordered_date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RewardTrack;
