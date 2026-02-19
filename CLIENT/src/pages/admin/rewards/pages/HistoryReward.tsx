import { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";

interface HistoryOrder {
  id: number;
  student_name: string;
  register_no: string;
  department: string;
  item: string;
  order_date: string;
  completed_date: string;
  status: string;
  coins: number;
}

// MOCK DATA for completed/delivered/rejected orders
const MOCK_HISTORY: HistoryOrder[] = [
  { id: 103, student_name: "Charlie Brown", register_no: "REG2023012", department: "Electrical Eng", item: "Coffee Mug", order_date: "2024-03-12", completed_date: "2024-03-13", status: "DELIVERED", coins: 200 },
  { id: 104, student_name: "Diana Prince", register_no: "REG2023099", department: "Civil Eng", item: "Stickers Pack", order_date: "2024-03-10", completed_date: "2024-03-10", status: "REJECTED", coins: 100 },
  { id: 99, student_name: "Bruce Wayne", register_no: "REG2023000", department: "Computer Science", item: "Premium Notebook", order_date: "2024-02-28", completed_date: "2024-03-01", status: "DELIVERED", coins: 500 },
];

const HistoryReward = () => {
  const [orders] = useState<HistoryOrder[]>(MOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order: HistoryOrder) =>
    order.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.register_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[var(--background)] w-full p-6 space-y-8 animate-fadeIn text-[var(--text-primary)]">
      {/* Header Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8 rounded-xl border-gray-200/30 dark:border-white/5 shadow-lg">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] dark:text-white">
            Order <span className="text-[var(--accent)]">History</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium flex items-center gap-2 opacity-80">
            <Calendar size={16} className="text-[var(--accent)]" />
            View past orders and completed transactions
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="w-full flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors duration-300">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search history by student name or register no..."
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

      {/* History Table */}
      <div className="w-full glass-card rounded-xl border-none overflow-hidden shadow-xl border-gray-200/20 dark:border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Order ID</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Student</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Item details</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Ordered Date</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Completed</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredOrders.map((order: HistoryOrder) => (
                <tr key={order.id} className="group hover:bg-[var(--accent)]/[0.03] transition-colors duration-200">
                  <td className="px-12 py-8">
                    <span className="font-bold text-sm text-[var(--text-secondary)] opacity-60">#{order.id}</span>
                  </td>
                  <td className="px-12 py-8">
                    <div className="font-bold text-base text-[var(--text-primary)] dark:text-white leading-snug mb-0.5 transition-colors duration-200 group-hover:text-[var(--accent)]">
                      {order.student_name}
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase opacity-60">
                      {order.register_no}
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="text-sm font-bold text-[var(--text-primary)] dark:text-white/90">
                      {order.item}
                    </div>
                    <div className="text-[10px] font-bold text-amber-600/80 mt-0.5 uppercase tracking-wide">
                      {order.coins} Coins
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                      <Calendar size={14} className="opacity-50" />
                      {order.order_date}
                    </div>
                  </td>
                  <td className="px-12 py-8 text-sm font-medium text-[var(--text-secondary)]">
                    {order.completed_date}
                  </td>
                  <td className="px-12 py-8">
                    <span className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border shadow-sm
                        ${order.status === 'DELIVERED' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20' :
                        order.status === 'REJECTED' ? 'bg-red-500/5 text-red-600 border-red-500/20' :
                          'bg-gray-500/5 text-gray-600 border-gray-500/20'}
                      `}>
                      <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-emerald-500' :
                        order.status === 'REJECTED' ? 'bg-red-500' :
                          'bg-gray-400'
                        }`} />
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="px-12 py-24 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-50/50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-50">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">No Records Found</h3>
              <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto font-medium opacity-70">Try adjusting your search query to find past redemptions.</p>
            </div>
          )}
        </div>
      </div>
=======
    <div className="w-full space-y-8">
      <h1 className="text-[length:var(--font-h1)] leading-[var(--font-h1--line-height)] font-black tracking-tight text-[var(--text-primary)]">History Reward</h1>
      <p className="text-[length:var(--font-body)] text-[var(--text-secondary)]">View reward history and past distributions</p>
>>>>>>> ashwin/lms_core
    </div>
  );
};

export default HistoryReward;
