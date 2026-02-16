import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi } from "../../api/apiservice";
import { useAppDispatch } from "../../redux/hooks";
import { setJWTToken } from "../../redux/features/jwtSlice";
import { setPermissions } from "../../redux/features/permissionsSlice";


type loginResponseType = {
  message: String,
  data: {
    token: string,
    permissions: String[],
    role: String
  },
  statusCode: number
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: loginResponseType = await postApi({ url: "/auth/login", data: { email, password } });

      // Support multiple token shapes
      const token = data.data.token;
      const role = data.data.role;
      const permissions = data.data.permissions;

      // Save to redux
      dispatch(setJWTToken({ jwtToken: token }));
      dispatch(setPermissions({
        permissions: permissions,
        role: role
      }));
      if (role === "STUDENT") {
        navigate("/dashboard/student")
      } else {
        navigate("/dashboard/admin")
      }
    } catch (err) {
      // postApi shows toasts; keep UI simple
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary-bg)] p-6">
      <div className="
        w-full 
        max-w-4xl 
        bg-[var(--color-surface)] 
        border border-[var(--color-border)] 
        rounded-2xl 
        shadow-2xl 
        overflow-hidden
        animate-fadeIn
      ">
        {/* Header Section: Logo + Title (Horizontal) */}
        <div className="p-8 md:p-12 border-b border-[var(--color-border)] flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <img
              src="/college-logo.jpg"
              alt="College Logo"
              className="h-24 md:h-32 w-auto object-contain"
            />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text-primary)] tracking-tight">
              LMS Platform <span className="text-[var(--color-text-secondary)] font-light">Sign In</span>
            </h1>
          </div>
        </div>

        {/* Content Section: Form */}
        <div className="p-8 md:p-16 lg:p-20">
          <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 gap-8">
              {/* LMS Code Field */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Email
                </label>
                <input
                  type="text"
                  value={email} // Reusing email state for code as per request
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your enter code
                  "
                  className="
                    w-full
                    px-6 py-4
                    text-xl
                    bg-neutral-50 dark:bg-neutral-900/30
                    border-2 border-[var(--color-border)]
                    rounded-xl
                    text-[var(--color-text-primary)]
                    placeholder:text-neutral-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[var(--color-accent)]
                    focus:border-transparent
                    transition-all
                  "
                />
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="
                    w-full
                    px-6 py-4
                    text-xl
                    bg-neutral-50 dark:bg-neutral-900/30
                    border-2 border-[var(--color-border)]
                    rounded-xl
                    text-[var(--color-text-primary)]
                    placeholder:text-neutral-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[var(--color-accent)]
                    focus:border-transparent
                    transition-all
                  "
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-[var(--color-accent)]
                  hover:bg-[var(--color-accent-hover)]
                  text-white
                  py-5
                  rounded-xl
                  font-bold
                  text-2xl
                  shadow-xl
                  transition-all
                  disabled:opacity-60
                  flex items-center justify-center gap-3
                "
              >
                {loading ? "Processing..." : "Sign In"}
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-[var(--color-text-secondary)] text-lg">
                Having trouble? <span className="text-[var(--color-accent)] font-bold cursor-pointer hover:underline">Contact Support</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
