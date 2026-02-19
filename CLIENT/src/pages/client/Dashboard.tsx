import React from "react";

const ClientDashboard: React.FC = () => {
  return (
    <div className="w-full space-y-8">
      <h1 className="text-[length:var(--font-h1)] leading-[var(--font-h1--line-height)] font-black tracking-tight text-[var(--text-primary)]">Student Dashboard</h1>
      <p className="text-[length:var(--font-body)] text-[var(--text-secondary)]">Welcome to Student Portal</p>
    </div>
  );
};

export default ClientDashboard;
