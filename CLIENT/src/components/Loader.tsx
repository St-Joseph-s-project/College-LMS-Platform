import React from "react";
import NeuralNetworkBackground from "./NeuralNetworkBackground";

type LoaderProps = {
  isLoading: boolean
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[var(--bg-color)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black transition-colors duration-300">

      {/* 1. Shared Background Animation */}
      <NeuralNetworkBackground />

      {/* 2. Glassmorphism Loading Card */}
      <div className="relative z-10 flex flex-col items-center justify-center px-12 py-28 rounded-3xl glass-card animate-fadeIn shadow-2xl backdrop-blur-2xl border border-[var(--card-border)] bg-[var(--card-glass)] max-w-[360px] w-full mx-4 gap-8">

        {/* Fun Animation: Pulsing Logo / Icon */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-pink-500 rounded-full animate-spin shadow-[0_0_8px_rgba(59,130,246,0.3)]"></div>

          {/* Inner pulsing circle */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center animate-pulse shadow-lg box-border border-2 border-white/10">
            <span className="text-xl drop-shadow-lg"></span>
          </div>
        </div>

        {/* Typing Text Effect */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-black text-[var(--text-primary)] neon-text tracking-[0.15em] uppercase">PIXELPREP</h3>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[var(--text-secondary)] font-bold text-xs tracking-widest opacity-90">Initializing System</p>
            <div className="flex gap-1 pt-0.5">
              <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-1 rounded-full bg-pink-500 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce"></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Loader