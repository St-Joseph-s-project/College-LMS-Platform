import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_NAME } from "../constants/appConstants";

const ThemeChanger = () => {
  // Initialize state based on localStorage or system preference
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const storedTheme = localStorage.getItem(THEME_NAME) as "light" | "dark" | null;
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Apply theme to document and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem(THEME_NAME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label="Toggle Theme"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? (
        <Sun className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-400 fill-blue-400" />
      )}
    </button>
  );
};

export default ThemeChanger;
