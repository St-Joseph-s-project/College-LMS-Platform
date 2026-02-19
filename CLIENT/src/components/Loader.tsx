import React from "react";


type LoaderProps = {
  isLoading: boolean
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden backdrop-blur-md bg-white/30 dark:bg-black/30 transition-colors duration-300">



      {/* 2. Loader Content (No Card Background) */}
      <div className="relative z-10 flex flex-col items-center justify-center px-12 py-28 rounded-3xl animate-fadeIn max-w-[360px] w-full mx-4 gap-8">

        {/* Fun Animation: Spinning Rings */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-pink-500 rounded-full animate-spin shadow-[0_0_8px_rgba(59,130,246,0.3)]"></div>
        </div>

        {/* Typing Text Effect */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-black text-[var(--text-primary)] neon-text tracking-[0.15em] uppercase">loading..</h3>
        </div>

      </div>
    </div>
  )
}

export default Loader