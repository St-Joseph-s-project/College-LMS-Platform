import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] relative flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Elements Animation */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-yellow-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-12deg] animate-pulse hidden md:block" />
      <div className="absolute bottom-20 right-20 w-12 h-12 bg-blue-500 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[12deg] animate-bounce hidden md:block" />

      {/* Main Card */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white border-3 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">

          {/* Decorative Corner Squares */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-500 border-2 border-black" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 border-2 border-black" />

          <div className="flex flex-col items-center text-center space-y-6">

            {/* Icon Wrapper */}
            <div className="w-20 h-20 bg-red-100 border-3 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
              <ShieldAlert className="w-10 h-10 text-red-600" strokeWidth={2.5} />
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tight">
                Access Denied
              </h2>
              <div className="h-1 w-full bg-black my-2"></div>
              <p className="text-lg font-bold text-gray-800">
                You don't have permission to view this page.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">

              <button
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white border-2 border-black px-6 py-3 font-black text-sm uppercase tracking-wide hover:bg-gray-900 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(100,100,100,1)] transition-all duration-200"
              >
                Home Page
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Unauthorized;
