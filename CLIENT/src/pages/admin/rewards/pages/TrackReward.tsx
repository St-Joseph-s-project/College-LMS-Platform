import { useState } from "react";
import { Search, Filter, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: number;
  student_name: string;
  register_no: string;
  department: string;
  item: string;
  date: string;
  status: string;
  coins: number;
}

const MOCK_ORDERS: Order[] = [
  { id: 101, student_name: "Alice Johnson", register_no: "REG2023001", department: "Computer Science", item: "Premium Notebook", date: "2024-03-15", status: "PENDING", coins: 500 },
  { id: 102, student_name: "Bob Smith", register_no: "REG2023045", department: "Mechanical Eng", item: "College Hoodie", date: "2024-03-14", status: "APPROVED", coins: 1500 },
  { id: 103, student_name: "Charlie Brown", register_no: "REG2023012", department: "Electrical Eng", item: "Coffee Mug", date: "2024-03-12", status: "DELIVERED", coins: 200 },
  { id: 104, student_name: "Diana Prince", register_no: "REG2023099", department: "Civil Eng", item: "Stickers Pack", date: "2024-03-10", status: "REJECTED", coins: 100 },
  { id: 105, student_name: "Ethan Hunt", register_no: "REG2023055", department: "Information Tech", item: "Premium Notebook", date: "2024-03-09", status: "PENDING", coins: 500 },
];

const TrackReward = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleUpdateStatus = (id: number, newStatus: string) => {
    // API call mock
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure? This will refund coins to the student.")) {
      // API call mock
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.register_no.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] w-full p-6 space-y-8 animate-fadeIn text-[var(--text-primary)]">
      {/* Header Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-card p-8 rounded-xl border-gray-200/30 dark:border-white/5 shadow-lg">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] dark:text-white">
            Order <span className="text-[var(--accent)]">Tracking</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium flex items-center gap-2 opacity-80">
            <CheckCircle size={16} className="text-[var(--accent)]" />
            Manage and track reward redemptions
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
            placeholder="Search by student name or register no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-8 py-4 bg-white/20 dark:bg-black/10 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all duration-300 text-base font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
          />
        </div>

        <div className="relative min-w-[200px]">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
            <Filter size={18} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white/20 dark:bg-black/10 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all duration-300 text-base font-bold cursor-pointer appearance-none shadow-sm"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="DELIVERED">Delivered</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Professional Orders Table */}
      <div className="w-full glass-card rounded-xl border-none overflow-hidden shadow-xl border-gray-200/20 dark:border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Ref ID</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Student</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Department</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Item</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70">Status</th>
                <th className="px-12 py-7 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredOrders.map((order) => (
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
                    <div className="text-sm font-medium text-[var(--text-secondary)]">
                      {order.department}
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-[var(--text-primary)] dark:text-white/90">
                        {order.item}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600/80 mt-0.5 uppercase tracking-wide">
                        {order.coins} Coins
                      </span>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <span className={`
                      inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border shadow-sm
                      ${order.status === 'DELIVERED' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20' :
                        order.status === 'PENDING' ? 'bg-amber-500/5 text-amber-600 border-amber-500/20' :
                          order.status === 'APPROVED' ? 'bg-blue-500/5 text-blue-600 border-blue-500/20' :
                            'bg-red-500/5 text-red-600 border-red-500/20'}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-emerald-500' :
                        order.status === 'PENDING' ? 'bg-amber-500' :
                          order.status === 'APPROVED' ? 'bg-blue-500' :
                            'bg-red-500'
                        }`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center justify-end gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="pl-3 pr-8 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all outline-none cursor-pointer hover:border-[var(--accent)]/50 appearance-none"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Ship</option>
                        <option value="DELIVERED">Finish</option>
                        <option value="REJECTED">Void</option>
                      </select>

                      <button
                        onClick={() => handleDelete(order.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                        title="Delete & Refund"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="px-8 py-24 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-50/50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-50">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">No Orders Found</h3>
              <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto font-medium opacity-70">We couldn't find any redemptions matching your current search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackReward;
