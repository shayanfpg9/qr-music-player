import { useState, useEffect, useCallback } from "react";
import * as bs from "react-icons/bs";

const useTheme = () => {
  const [themeIcon, setThemeIcon] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  const applyTheme = (themeName) => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(themeName);
    localStorage.setItem("theme", themeName);
    setTheme(themeName);
  };

  const handleThemeChange = useCallback((newTheme) => {
    let finalTheme = newTheme;

    if (newTheme === "system") {
      finalTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    applyTheme(finalTheme);

    switch (finalTheme) {
      case "dark":
        setThemeIcon(<bs.BsFillMoonStarsFill />);
        break;
      case "light":
        setThemeIcon(<bs.BsFillSunFill />);
        break;
      default:
        setThemeIcon(<bs.BsFillDropletFill />);
    }
  }, []);

  useEffect(() => {
    handleThemeChange(localStorage.getItem("theme") || "system");
  }, [handleThemeChange]);

  return { theme, themeIcon, handleThemeChange };
};

export default useTheme;
