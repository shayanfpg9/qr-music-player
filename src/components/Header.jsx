import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { BsFillShareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import DownloadButton from "./DownloadBtn";
import { TbLoader } from "react-icons/tb";
import { FaDownload } from "react-icons/fa";
import { TrackContext } from "../context/TrackContext";
import handleShare from "../script/handleshare";

const Header = () => {
  const { theme, icon: ThemeIcon, change: setTheme } = useContext(ThemeContext);
  const { trackInfo, handleDownload, downloading } = useContext(TrackContext);

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center font-bold text-xl">
      <Link to="/">
        <h1>Music Player</h1>
      </Link>

      <div className="space-x-4">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {ThemeIcon}
        </button>

        {trackInfo && (
          <button onClick={handleShare} title="Share">
            <BsFillShareFill />
          </button>
        )}

        {trackInfo && (
          <DownloadButton
            className="mx-2 inline-block"
            title="Download music"
            src={trackInfo?.src}
            onClick={handleDownload}
            filename={`${trackInfo?.trackName || "Unknown Track"}-${
              trackInfo.artistName || "Unknown Artist"
            } [${location.host}].mp3`}
          >
            {downloading ? (
              <TbLoader className="mr-2 animate-spin-slow" />
            ) : (
              <FaDownload className="mr-2" />
            )}
          </DownloadButton>
        )}
      </div>
    </header>
  );
};

export default Header;
