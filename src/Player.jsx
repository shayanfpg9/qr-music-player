import { useState, useEffect, useContext, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import axios from "axios";
import { QRCode } from "react-qrcode-logo";
import { ThemeContext } from "./context/ThemeContext";
import handleShare from "./script/handleshare";
import Favicon from "./components/Faviction";
import replace from "./script/replace";
import { FaDownload } from "react-icons/fa";
import DownloadButton from "./components/DownloadBtn";
import { TbLoader } from "react-icons/tb";
import { TrackContext } from "./context/TrackContext";

const Player = () => {
  const { setInfo, downloading, handleDownload } = useContext(TrackContext);

  const urlParams = new URLSearchParams(window.location.search);
  const src = urlParams.get("link");
  const name = urlParams.get("name");
  const text = urlParams.get("text");
  const from = urlParams.get("from");
  const site = urlParams.get("site");

  const [play, setPlay] = useState(false);
  const [trackInfo, setTrackInfo] = useState({});
  const [imageZoom, setImageZoom] = useState(false);
  const [volume, setVolume] = useState(1);
  const { theme } = useContext(ThemeContext);
  const qrRef = useRef(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${trackInfo?.trackName || "Unknown Track"}-${
          trackInfo.artistName || "Unknown Artist"
        } [${location.host}].png`;
        link.click();
      }, "image/png");
    }
  };

  useEffect(() => {
    if (name) {
      axios
        .get(`https://itunes.apple.com/search?term=${name}&limit=1`)
        .then((response) => {
          if (response.data.results.length > 0) {
            setTrackInfo(response.data.results[0]);
            setInfo({ ...response.data.results[0], text, src });
          }
        })
        .catch((error) => console.error(error));
    }
  }, [name, setInfo, src, text]);

  // Function to fetch image as base64
  const getBase64Image = (url, callback) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      callback(dataURL);
    };
    img.src = url;
  };

  const [logoBase64, setLogoBase64] = useState(null);

  useEffect(() => {
    if (trackInfo.artworkUrl100) {
      getBase64Image(
        trackInfo.artworkUrl100.replaceAll("100", "200"),
        setLogoBase64
      );
    }
  }, [trackInfo.artworkUrl100]);

  return (
    <section
      className={`p-4 max-w-xl mx-auto bg-slate-50 dark:bg-gray-900 rounded-xl shadow-md space-y-4 ${theme}`}
    >
      <div className="space-y-2 py-2 flex justify-center flex-wrap *:w-full text-center">
        {trackInfo.artworkUrl100 && (
          <img
            src={trackInfo.artworkUrl100.replaceAll("100", "200")}
            alt="Artwork"
            className={`rounded-full !size-[10rem] border-[.3rem] border-gray-900 dark:border-white transition-transform ease-in-out ${
              imageZoom ? "zoom" : play && "animate-bounce"
            }`}
            onMouseEnter={() => setImageZoom(true)}
            onMouseLeave={() => setImageZoom(false)}
            title="Artwork"
          />
        )}

        <h1
          className="text-3xl font-bold pt-2 text-gray-900 dark:text-white"
          title="Track Name"
        >
          {trackInfo.trackName || "Unknown Track"}
        </h1>
        <h2 className="text-gray-500 dark:text-gray-400" title="Artist Name">
          {trackInfo.artistName || "Unknown Artist"} -{" "}
          {trackInfo.collectionName || "Unknown Collection"}
          <DownloadButton
            className="mx-2 inline-block"
            title="Download music"
            src={src}
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
        </h2>
      </div>

      <AudioPlayer
        src={src}
        onPlaying={() => setPlay(true)}
        onPause={() => setPlay(false)}
        volume={volume}
        onVolumeChange={(e) => setVolume(e.target.volume)}
        className={"rounded-lg player_" + theme}
      />

      <div className="w-full flex *:flex-1">
        {text && (
          <div>
            <span className="font-bold text-xl">Description:</span>
            <p
              className="text-gray-700 dark:text-gray-300 text-center text-lg"
              title="Description"
            >
              {replace(text)}
            </p>
          </div>
        )}

        {site && (
          <p>
            From:
            <br />
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              <Favicon domain={site} size={32} className="inline-block mr-1" />
              {replace(from) ?? replace(site)}
            </a>
          </p>
        )}
      </div>

      <div ref={qrRef} className="flex max-md:flex-col max-md:space-y-4">
        <div className="bg-gray-100 dark:bg-[#1a202c] rounded-md flex max-md:justify-center">
          <QRCode
            value={window.location.href}
            logoImage={logoBase64}
            logoWidth={75}
            logoHeight={75}
            logoOpacity={1}
            removeQrCodeBehindLogo={true}
            qrStyle="dots"
            eyeRadius={10}
            size={200}
            title="QR Code"
            bgColor="transparent"
            fgColor={theme === "dark" ? "#ffffff" : "#000000"}
          />
        </div>

        <div className="flex flex-wrap *:w-full space-y-4 md:px-2 *:text-xl *:text-white *:px-4 *:py-2 *:rounded">
          <DownloadButton
            className={
              "bg-red-500 hover:bg-red-600 rounded flex items-center justify-center " +
              (downloading && "animate-pulse")
            }
            title="Download music"
            onClick={handleDownload}
            src={src}
            filename={`${trackInfo?.trackName || "Unknown Track"}-${
              trackInfo.artistName || "Unknown Artist"
            } [${location.host}].mp3`}
          >
            Download music
          </DownloadButton>

          <button
            onClick={downloadQRCode}
            className="bg-green-500 hover:bg-green-600"
            title="Download QR Code"
          >
            Download QR Code
          </button>

          <button
            onClick={handleShare}
            className="bg-blue-500 hover:bg-blue-600"
            title="Share this page"
          >
            Share this page
          </button>
        </div>
      </div>
    </section>
  );
};

export default Player;
