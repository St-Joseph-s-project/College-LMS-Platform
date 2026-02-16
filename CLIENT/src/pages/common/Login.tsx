import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi } from "../../api/apiservice";
import { useAppDispatch } from "../../redux/hooks";
import { setJWTToken } from "../../redux/features/jwtSlice";
import { setPermissions } from "../../redux/features/permissionsSlice";
import logo from "../../assets/logo1.png";
import { ThemeChanger } from "../../components";

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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data: loginResponseType = await postApi({ url: "/auth/login", data: { email, password } });

      // Support multiple token shapes
      const token = data.data.token;
      const role = data.data.role;
      const permissions = data.data.permissions;

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

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary-alpha)] rounded-full blur-3xl opacity-20 animate-[float_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--primary-alpha)] rounded-full blur-3xl opacity-20 animate-[float_6s_ease-in-out_infinite_reverse]"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] bg-[var(--surface-color)] border border-[var(--border-color)] relative z-10 backdrop-blur-sm">

        <div className="flex items-center justify-center p-12 lg:p-16 bg-[var(--bg-muted)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--accent)] to-transparent"></div>
          </div>
          <div className="relative z-10 w-full max-w-md">
            <img
              src={logo}
              className="w-full h-auto object-contain drop-shadow-2xl animate-[fadeIn_0.6s_ease-out]"
              alt="LMS Platform Logo"
            />
            <div className="mt-8 text-center animate-[fadeIn_0.8s_ease-out]">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">LMS Platform</h2>
              <p className="text-[var(--text-secondary)]">Empowering Education Through Technology</p>
            </div>
          </div>
        </div>


        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[var(--surface-color)]">
          <div className="mb-10 animate-[fadeIn_0.4s_ease-out]">
            <h1 className="text-4xl font-bold mb-3 text-[var(--text-primary)] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Sign in to continue to LMS Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 animate-[fadeIn_0.6s_ease-out]">
            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)] transition-colors group-focus-within:text-[var(--accent)]">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--surface-color)] border-2 border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none transition-all duration-300 focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_var(--primary-alpha)] hover:border-[var(--text-secondary)]"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] opacity-0 group-focus-within:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)] transition-colors group-focus-within:text-[var(--accent)]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--surface-color)] border-2 border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none transition-all duration-300 focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_var(--primary-alpha)] hover:border-[var(--text-secondary)]"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] opacity-0 group-focus-within:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group/check">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2 border-[var(--border-color)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--primary-alpha)] transition-all cursor-pointer"
                />
                <span className="text-sm text-[var(--text-secondary)] group-hover/check:text-[var(--text-primary)] transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"

              className="w-full py-4 rounded-xl font-bold text-white text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 shadow-lg hover:shadow-xl relative overflow-hidden group/btn"
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] transition-opacity duration-300   opacity-100`}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-hover)] to-[var(--accent)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">


                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>

              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}