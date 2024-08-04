import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { BsFillShareFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export const handleShare = () => {
  const trackInfo = window.track;
  if (navigator.share) {
    navigator
      .share({
        title:
          (trackInfo?.trackName || "Unknown Track") +
          " / " +
          (trackInfo?.artistName || "Unknown Artist") +
          " - " +
          (trackInfo?.collectionName || "Unknown Collection"),
        text: trackInfo?.text || "Check out this song!",
        url: window.location.href,
      })
      .catch((error) => console.error("Error sharing:", error));
  } else {
    navigator.clipboard.writeText(window.location.href);
  }
};

const Header = () => {
  const { theme, icon: ThemeIcon, change: setTheme } = useContext(ThemeContext);
  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center font-bold text-xl">
      <Link to="/">
        <h1>Music Player</h1>
      </Link>

      <div className="space-x-4">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {ThemeIcon}
        </button>

        <button onClick={handleShare} title="Share">
          <BsFillShareFill />
        </button>
      </div>
    </header>
  );
};

export default Header;
