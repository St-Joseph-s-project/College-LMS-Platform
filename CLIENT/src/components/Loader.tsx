import React from "react";

type LoaderProps = {
  isLoading: boolean
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="w-full h-full fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex flex-col p-8 justify-center items-center gap-6 border border-border rounded-xl bg-surface shadow-2xl animate-fadeIn">
        {/* Single glowing spinning loader */}
        <div className="relative">
          {/* Glow effect background */}
          <div className="absolute inset-0 w-20 h-20 bg-accent rounded-full blur-xl opacity-30 animate-pulse"></div>

          {/* Main spinning loader */}
          <div className="relative w-16 h-16">
            {/* Outer spinning ring with gradient */}
            <div className="absolute inset-0 border-4 border-transparent border-t-accent border-r-accent rounded-full animate-spin shadow-lg"></div>

            {/* Inner solid circle */}
            <div className="absolute inset-2 bg-accent rounded-full shadow-inner"></div>

            {/* Center highlight */}
            <div className="absolute inset-4 bg-white rounded-full opacity-80"></div>
          </div>
        </div>

        {/* Simple loading text */}
        <p className="text-text-primary text-body font-medium">Loading Info From Server</p>
      </div>
    </div>
  )
}

export default Loader