"use client";
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  return (
    <div
      className="flex items-center dark:bg-gray-900 bg-teal-500 cursor-pointer rounded-full p-2"
      onClick={() => setDarkMode(!darkMode)}
    >
      {/* Afficher la lune si darkMode est activé */}
      {darkMode ? (
        <FaMoon className="text-white" size={14} />
      ) : (
        /* Afficher le soleil si darkMode est désactivé */
        <BsSunFill className="text-yellow-400 ml-auto" size={14} />
      )}
    </div>
  );
};

export default ThemeToggle;
