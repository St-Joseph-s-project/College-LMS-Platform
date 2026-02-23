import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

const Unauthorized: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-lg text-center">
        <div className="glass-card p-12 rounded-[2rem] border border-gray-200/30 dark:border-white/10 shadow-2xl space-y-8 animate-in zoom-in duration-500">

          <div className="flex justify-center flex-col items-center gap-4">
            <div className="relative">
              <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400 animate-pulse transition-all">
                <ShieldAlert size={48} strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-8xl font-black tracking-tighter bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-300 dark:to-gray-500 bg-clip-text text-transparent opacity-90 leading-none">
              403
            </h1>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Access Denied
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-[320px] mx-auto leading-relaxed">
              You do not have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 transition-all active:scale-95 text-sm"
            >
              <Home size={18} />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-8 py-3 bg-gray-100 dark:bg-white/5 text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95 text-sm"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </div>

        <p className="mt-8 text-sm text-[var(--text-secondary)] font-medium opacity-50">
          St. Joseph's College LMS Platform
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
