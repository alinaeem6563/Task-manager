import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            return (
                localStorage.getItem("darkMode") === "true" ||
                (!localStorage.getItem("darkMode") &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches)
            );
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            document.body.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.body.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-foreground dark:text-gray-200 transition-colors duration-200 hover:bg-gray-400 dark:hover:bg-neutral-600"
            aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
        >
            {darkMode ? (
                <Sun className="h-6 w-6 text-neutral-100" />
            ) : (
                <Moon className="h-6 w-6 text-neutral-700 dark:text-gray-300" />
            )}
        </button>
    );
};

export default DarkModeToggle;
