import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

/**
 * Unauthorized Page - Simple Theme-Aligned Design
 */
const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary-bg)] p-6 animate-fadeIn">
      {/* Background Grid (Subtle) */}
      <div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-10 text-center space-y-8">

        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-[var(--color-error)]/10 rounded-full">
            <ShieldAlert className="w-16 h-16 text-[var(--color-error)]" strokeWidth={2} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-[var(--font-h2)] leading-[var(--font-h2--line-height)] font-bold text-[var(--color-text-primary)]">
            Access Denied
          </h1>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Home className="w-5 h-5" />
            Go back to Home
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[var(--color-border)]">
          <p className="text-[var(--font-small)] leading-[var(--font-small--line-height)] text-[var(--color-text-secondary)] opacity-60 font-medium">
            Error Code: 403 Forbidden
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
