import React from "react";
import { Loader2 } from "lucide-react";

type LoaderProps = {
  isLoading: boolean;
};

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/10 dark:bg-black/20 backdrop-blur-xl transition-all duration-300 animate-in fade-in">
      <div className="flex flex-col items-center gap-6 p-12 rounded-3xl">
        {/* Refined Spinner */}
        <div className="relative flex items-center justify-center">
          <Loader2
            className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin"
            strokeWidth={1.5}
          />
          {/* Subtle pulse ring */}
          <div className="absolute inset-0 w-12 h-12 border-4 border-blue-500/20 rounded-full animate-ping shadow-[0_0_15px_rgba(37,99,235,0.2)]"></div>
        </div>

        {/* Minimal Loading Text */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-bold text-gray-900 dark:text-white tracking-[0.3em] uppercase opacity-80 animate-pulse">
            Processing
          </span>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-400 animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;