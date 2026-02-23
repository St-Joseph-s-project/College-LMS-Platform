import { useState, useEffect } from "react";
import { Search, Filter, Loader } from "lucide-react";
import { getPendingRewards, updateOrderStatus } from "../api/rewardApi";
import type { RewardOrder } from "../types/reward";

const TrackReward = () => {
  const [orders, setOrders] = useState<RewardOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await getPendingRewards();
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch pending rewards", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      // Re-fetch or intelligently update array
      // If completed/rejected, it might move out of pending, so we must refetch
      fetchPending();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchMatch =
      order.users?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.users?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.rewards?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === "ALL" || order.status === statusFilter;
    return searchMatch && statusMatch;
  });

  return (
    <div className="space-y-8 animate-fadeIn w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Order Tracking
            </h1>
            <p className="text-[var(--text-secondary)] max-w-2xl text-base leading-relaxed">
              Manage and track reward redemptions
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
            placeholder="Search by student name, email, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-[var(--text-primary)]"
          />
        </div>

        <div className="relative min-w-[180px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-[var(--text-primary)] appearance-none cursor-pointer font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Filter size={16} />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-[var(--border-color)] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader className="animate-spin text-blue-600 mx-auto" size={24} />
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Fetching orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <Search size={24} />
                    </div>
                    <p className="text-[var(--text-primary)] font-medium">No pending orders found</p>
                    <p className="text-sm text-gray-500 mt-1">Check back later for new redemptions</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 font-mono">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[var(--text-primary)]">{order.users?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{order.users?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[var(--text-primary)]">{order.rewards?.title || 'Unknown Item'}</div>
                      <div className="text-xs text-amber-600 font-medium mt-0.5">{order.rewards?.coins || 0} Coins</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.ordered_date ? new Date(order.ordered_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        order.status === 'APPROVED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="pl-3 pr-8 py-1.5 text-xs font-medium rounded-lg border border-[var(--border-color)] bg-white dark:bg-zinc-900 text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Ship</option>
                        <option value="DELIVERED">Finish</option>
                        <option value="REJECTED">Void</option>
                      </select>
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

export default TrackReward;
