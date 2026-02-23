import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi } from "../../api/apiservice";
import { useAppDispatch } from "../../redux/hooks";
import { setJWTToken } from "../../redux/features/jwtSlice";
import { setPermissions } from "../../redux/features/permissionsSlice";
import logo from "../../assets/logo1.png";
import ThemeChanger from "../../components/themeChanger";

type loginResponseType = {
  message: string,
  data: {
    token: string,
    permissions: string[],
    role: string
  },
  statusCode: number
}

import NeuralNetworkBackground from "../../components/NeuralNetworkBackground";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data: loginResponseType = await postApi({ url: "/auth/login", data: { email, password } });


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
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg-color)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black flex items-center justify-center font-sans transition-colors duration-300 p-4">
      {/* Shared Background Component */}
      <NeuralNetworkBackground />


      {/* Main Login Card - Glassmorphism */}
      <div
        className="relative z-10 w-full max-w-5xl h-[80vh] grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ease-out glass-card"
      >

        {/* Left Side: Building Image */}
        <div className="relative z-20 hidden md:flex flex-col justify-end p-12 text-white bg-black/20 bg-cover bg-center" style={{ backgroundImage: "url('https://portal.stjosephstechnology.ac.in/portal/images/entrance.jpeg')" }}>
        </div>

        {/* Right Side: Branding & Login Form */}
        <div className="relative z-20 flex flex-col justify-center items-center h-full p-8 sm:p-12 backdrop-blur-md transition-colors duration-300">

          {/* Theme Toggle */}
          <div className="absolute top-6 right-6 z-30">
            <ThemeChanger />
          </div>

          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">

            <div className="flex flex-col items-center mb-8 text-center">
              <div className=" mb-4">
                <img src={logo} alt="Logo" className="w-56 h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">LMS</h1>

            </div>

            <div className="w-full mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Welcome Back</h2>
              <p className="text-[var(--text-secondary)] text-sm">Welcome back to the hive mind.</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full grid gap-6">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-base font-semibold text-[var(--text-primary)] ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-[var(--input-bg)] text-[var(--input-text)] text-lg text-center border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-600 shadow-inner"
                  placeholder="name@example.com"
                  id="email"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label htmlFor="password" className="block text-base font-semibold text-[var(--text-primary)]">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors">Forgot Password?</a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-[var(--input-bg)] text-[var(--input-text)] text-lg text-center border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-600 shadow-inner"
                  placeholder="••••••••"
                  id="password"
                />
              </div>

              <div className="flex items-center ml-1 py-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 w-4 h-4 transition-colors" />
                  <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg rounded-xl font-bold shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>



          </div>

        </div>
      </div>
    </div>
  );
}