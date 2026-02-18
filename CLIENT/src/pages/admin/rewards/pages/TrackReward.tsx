
import React, { useState } from "react";
import { Search, Filter, CheckCircle, XCircle } from "lucide-react";

const MOCK_ORDERS = [
  { id: 101, student_name: "Alice Johnson", register_no: "REG2023001", department: "Computer Science", item: "Premium Notebook", date: "2024-03-15", status: "PENDING", coins: 500 },
  { id: 102, student_name: "Bob Smith", register_no: "REG2023045", department: "Mechanical Eng", item: "College Hoodie", date: "2024-03-14", status: "APPROVED", coins: 1500 },
  { id: 103, student_name: "Charlie Brown", register_no: "REG2023012", department: "Electrical Eng", item: "Coffee Mug", date: "2024-03-12", status: "DELIVERED", coins: 200 },
  { id: 104, student_name: "Diana Prince", register_no: "REG2023099", department: "Civil Eng", item: "Stickers Pack", date: "2024-03-10", status: "REJECTED", coins: 100 },
  { id: 105, student_name: "Ethan Hunt", register_no: "REG2023055", department: "Information Tech", item: "Premium Notebook", date: "2024-03-09", status: "PENDING", coins: 500 },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  APPROVED: "bg-blue-100 text-blue-700 border-blue-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

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
    <div className="min-h-screen bg-[var(--background)] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]">
            Order Tracking
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">Monitor and manage student reward orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--surface-color)] p-4 rounded-xl border border-[var(--border-color)] flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
          <input
            type="text"
            placeholder="Search by name or register no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-muted)] rounded-lg border-none outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all text-[var(--text-primary)]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[var(--bg-muted)] rounded-lg border-none outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-primary)] cursor-pointer"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="DELIVERED">Delivered</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[var(--surface-color)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-muted)] border-b border-[var(--border-color)]">
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Order ID</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Student</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Department</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Item</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Date</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm">Status</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)] text-sm text-right">Actions</th>
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
                  <td className="p-4 text-[var(--text-secondary)] text-sm">{order.department}</td>
                  <td className="p-4 text-[var(--text-primary)]">{order.item}</td>
                  <td className="p-4 text-[var(--text-secondary)] text-sm">{order.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Action Dropdown Mock */}
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="px-2 py-1 text-xs rounded border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)]"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approve</option>
                        <option value="DELIVERED">Deliver</option>
                        <option value="REJECTED">Reject</option>
                      </select>

                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete & Refund"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              No orders found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackReward;
