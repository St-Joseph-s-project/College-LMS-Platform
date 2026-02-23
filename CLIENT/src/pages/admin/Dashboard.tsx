import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="w-full">
      <h1 className="text-[length:var(--font-h1)] leading-[var(--font-h1--line-height)] font-black tracking-tight text-[var(--text-primary)] m-0 mb-4">Admin Dashboard</h1>
      <p className="text-[length:var(--font-body)] text-[var(--text-secondary)] m-0">Welcome back to your control center.</p>
    </div>
  );
};

export default AdminDashboard;
