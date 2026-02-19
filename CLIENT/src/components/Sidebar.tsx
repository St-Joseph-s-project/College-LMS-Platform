import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { RouteConfig } from "../constants/routeConfig";
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import { useAppDispatch } from "../redux/hooks";
import { clearJWTToken } from "../redux/features/jwtSlice";
import { clearPermissions } from "../redux/features/permissionsSlice";

interface SidebarProps {
  routes: RouteConfig[];
  onNavigate: (path: string, permission: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ routes, onNavigate, isCollapsed, onToggle, className = "" }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Theme Management
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleMenu = (path: string) => {
    if (isCollapsed) return;
    setExpandedMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleLogout = () => {
    dispatch(clearJWTToken());
    dispatch(clearPermissions());
    navigate("/");
  };

  const isExactActive = (path: string) => location.pathname === path;
  const isParentActive = (path: string) => location.pathname.startsWith(path + "/") && location.pathname !== path;

  const renderMenuItem = (route: RouteConfig, level: number = 0) => {
    if (route.showInSidebar === false) return null;

    const hasChildren = route.children && route.children.length > 0;
    const isExpanded = expandedMenus.includes(route.path) || isParentActive(route.path);
    const exactActive = isExactActive(route.path);
    const parentActive = isParentActive(route.path);
    const anyActive = exactActive || parentActive;

    return (
      <div key={route.path} className="w-full">
        <div
          onClick={() => {
            if (hasChildren) {
              toggleMenu(route.path);
            } else {
              onNavigate(route.path, route.permission);
            }
          }}
          className={`
            flex items-center cursor-pointer transition-all duration-300 group rounded-2xl mb-2
            ${isCollapsed ? 'mx-2 justify-center px-0 py-4' : 'mx-6 justify-start px-3 py-3'}
            ${exactActive
              ? 'bg-blue-600 dark:bg-blue-600/30 text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)]'
              : parentActive
                ? 'bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}
            ${!isCollapsed && level > 0 ? 'pl-12' : ''}
          `}
        >
          <div className={`${anyActive ? 'text-white dark:text-blue-400' : 'text-inherit group-hover:text-blue-600 dark:group-hover:text-blue-400'} transition-colors duration-300 flex-shrink-0 flex items-center justify-center`}>
            {route.icon || <div className="w-[18px] h-[18px] flex items-center justify-center font-bold">•</div>}
          </div>
          {!isCollapsed && (
            <>
              <span className={`flex-1 ml-4 text-[0.9rem] tracking-tight ${anyActive ? 'font-bold' : 'font-medium'}`}>
                {route.label}
              </span>
              {hasChildren && (
                <div className={`${anyActive ? 'text-white/70 dark:text-blue-400' : 'text-gray-400 dark:text-white/40'} transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronDown size={14} />
                </div>
              )}
            </>
          )}
        </div>
        {hasChildren && (isExpanded || expandedMenus.includes(route.path)) && !isCollapsed && (
          <div className="mt-1 mb-2 flex flex-col gap-1">
            {route.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        ${isCollapsed ? 'w-20' : 'w-[260px]'}
        ${className.includes('static') ? '' : 'fixed left-6 top-6 bottom-6'} z-[1000]
        bg-white/70 dark:bg-black/40 backdrop-blur-3xl 
        border border-gray-200 dark:border-white/10 
        rounded-2xl transition-all duration-500 ease-in-out
        flex flex-col shadow-xl overflow-hidden
        ${className}
      `}
    >
      {/* Header / Brand */}
      <div
        className={`
          h-20 border-b border-[var(--card-border)]
          flex items-center px-4 relative
          justify-center
        `}
      >
        {!isCollapsed && (
          <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white m-0 whitespace-nowrap">
            LMS
          </h1>
        )}
        <button
          onClick={onToggle}
          className={`
            w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 
            flex items-center justify-center cursor-pointer text-gray-600 dark:text-white/70 
            hover:text-gray-900 dark:hover:text-white transition-all duration-300 border border-transparent
            ${isCollapsed ? '' : 'absolute right-4'}
          `}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-6 flex flex-col gap-1">
        {routes.map((route) => renderMenuItem(route))}
      </nav>

      {/* Footer / User Actions */}
      <div className="p-4 border-t border-[var(--card-border)] bg-gray-50/50 dark:bg-white/5 flex flex-col gap-2 shadow-inner">
        {/* Theme Toggle */}
        <div
          onClick={toggleTheme}
          className={`
            flex items-center cursor-pointer p-4 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 group mx-2
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
        >
          <div className="transition-colors">
            {theme === "light" ? (
              <Moon size={18} className="text-blue-600" />
            ) : (
              <Sun size={18} className="text-yellow-400" />
            )}
          </div>
          {!isCollapsed && (
            <span className="ml-4 text-[0.9rem] font-semibold text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          )}
        </div>

        {/* Sign Out */}
        <div
          onClick={handleLogout}
          className={`
            flex items-center justify-center cursor-pointer p-3 rounded-xl hover:bg-red-500/10 transition-all duration-300 group mx-1
            text-gray-600 dark:text-white/60 hover:text-red-500
          `}
        >
          {!isCollapsed ? (
            <span className="text-[0.9rem] font-semibold">
              Sign Out
            </span>
          ) : (
            <span className="text-[0.7rem] font-bold">OUT</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
