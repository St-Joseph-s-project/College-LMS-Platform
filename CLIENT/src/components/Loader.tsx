import React from "react";
import { Loader2 } from "lucide-react";

type LoaderProps = {
  isLoading: boolean;
};

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg-color)]/20 dark:bg-[var(--bg-color)]/40 backdrop-blur-xl transition-all duration-300 animate-in fade-in">
      <div className="flex flex-col items-center gap-6 p-8 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] shadow-lg shadow-[var(--accent)]/5">
        {/* Refined Spinner */}
        <div className="relative flex items-center justify-center">
          <Loader2
            className="w-12 h-12 text-[var(--accent)] animate-spin"
            strokeWidth={1.5}
          />
          {/* Subtle pulse ring */}
          <div className="absolute inset-0 w-12 h-12 border-4 border-[var(--accent)]/20 rounded-full animate-ping shadow-[0_0_15px_var(--accent)] opacity-20"></div>
        </div>

        {/* Minimal Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold text-[var(--text-primary)] tracking-[0.3em] uppercase opacity-80 animate-pulse">
            Processing
          </span>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent rounded-full overflow-hidden">
            <div className="w-full h-full bg-[var(--accent)] animate-shimmer opacity-80"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;