
import React, { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";

// MOCK DATA for completed/delivered/rejected orders
const MOCK_HISTORY = [
  { id: 103, student_name: "Charlie Brown", register_no: "REG2023012", department: "Electrical Eng", item: "Coffee Mug", order_date: "2024-03-12", completed_date: "2024-03-13", status: "DELIVERED", coins: 200 },
  { id: 104, student_name: "Diana Prince", register_no: "REG2023099", department: "Civil Eng", item: "Stickers Pack", order_date: "2024-03-10", completed_date: "2024-03-10", status: "REJECTED", coins: 100 },
  { id: 99, student_name: "Bruce Wayne", register_no: "REG2023000", department: "Computer Science", item: "Premium Notebook", order_date: "2024-02-28", completed_date: "2024-03-01", status: "DELIVERED", coins: 500 },
];

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

const HistoryReward = () => {
  const [orders] = useState(MOCK_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(order =>
    order.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.register_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]">
            Order History
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">View past orders and transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--surface-color)] p-4 rounded-xl border border-[var(--border-color)] flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-muted)] rounded-lg border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-[var(--text-primary)]"
          />
        </div>
        <button className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* History Table */}
      <div className="bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-muted)] border-b border-[var(--border-color)]">
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Order ID</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Student</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Item details</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Ordered Date</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Completed Date</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  <td className="p-4 text-[var(--text-primary)] font-medium">#{order.id}</td>
                  <td className="p-4">
                    <div className="font-medium text-[var(--text-primary)]">{order.student_name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{order.register_no}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[var(--text-primary)]">{order.item}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{order.coins} Coins</div>
                  </td>
                  <td className="p-4 text-[var(--text-secondary)] text-sm flex items-center gap-2">
                    <Calendar size={14} /> {order.order_date}
                  </td>
                  <td className="p-4 text-[var(--text-secondary)] text-sm">
                    {order.completed_date}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              No history records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryReward;
