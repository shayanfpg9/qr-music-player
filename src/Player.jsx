import { useState, useEffect, useContext, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import axios from "axios";
import { QRCode } from "react-qrcode-logo";
import { ThemeContext } from "./context/ThemeContext";
import handleShare from "./script/handleshare";
import Favicon from "./components/Faviction";
import replace from "./script/replace";
import { FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import DownloadButton from "./components/DownloadBtn";
import { TbLoader } from "react-icons/tb";
import { TrackContext } from "./context/TrackContext";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

const proxy = "https://corsproxy.io/?";

const Player = () => {
  const { setInfo, downloading, handleDownload } = useContext(TrackContext);
  const [serachParams, setSeachParams] = useSearchParams();
  const location = useLocation();

  const src = proxy + encodeURI(serachParams.get("src"));
  const name = useParams().name.replaceAll("+", " ");
  const text = serachParams.get("text");
  const from = serachParams.get("from");
  const site = serachParams.get("site");
  const index = +serachParams.get("page") > 1 ? +serachParams.get("page") : 1;

  const [error, setError] = useState(false);
  const [play, setPlay] = useState(false);
  const [trackInfo, setTrackInfo] = useState({});
  const [imageZoom, setImageZoom] = useState(false);
  const [volume, setVolume] = useState(1);
  const { theme } = useContext(ThemeContext);
  const qrRef = useRef(null);
  const mount = useRef(false);

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
    mount.current = false;
    setError(false);

    setTrackInfo({});
    setInfo({});
  }, [location]); // eslint-disable-line

  useEffect(() => {
    if (name) {
      axios
        .get(
          `https://corsproxy.io/?https://itunes.apple.com/search?term=${encodeURIComponent(
            name
          )}&limit=${index}`,
          {
            timeout: 10000,
          }
        )
        .then((response) => {
          mount.current = true;

          if (
            response.data.results.length > 0 &&
            response.data.results[index - 1]
          ) {
            if (response.data.results.length < index) setError(true);

            setTrackInfo(response.data.results[index - 1]);
            setInfo({ ...response.data.results[index - 1], text, src });

            if (!response.data.results[0].trackName) setError(true);
          } else {
            setError(true);
          }
        })
        .catch(() => {
          mount.current = true;
          setError(true);
        });
    }
  }, [name, setInfo, src, text, index]);

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
    img.src = proxy + url;
  };

  const [logoBase64, setLogoBase64] = useState(null);

  useEffect(() => {
    if (trackInfo?.artworkUrl100 && !error) {
      getBase64Image(
        trackInfo.artworkUrl100.replaceAll("100", "200"),
        setLogoBase64
      );
    }
  }, [trackInfo?.artworkUrl100, error]);

  return (
    <section
      className={`p-4 max-w-xl mx-auto bg-slate-50 dark:bg-gray-900 rounded-xl shadow-md space-y-4 ${theme}`}
    >
      {!mount.current ? (
        <TbLoader
          size={100}
          className="animate-spin-slow text-gray-900 dark:text-white"
        />
      ) : error ? (
        <div className="flex justify-center flex-wrap *:w-full *:p-4 *:text-center space-y-4">
          <span className="text-4xl text-gray-900 dark:text-white">
            Error 404{" "}
          </span>
          <Link
            title="Home"
            to="/"
            className="bg-blue-500 hover:bg-blue-600 text-2xl rounded-lg"
          >
            Home
          </Link>
          <button
            title="Refresh"
            onClick={() => location.reload()}
            className="bg-yellow-500 hover:bg-yellow-600 text-2xl rounded-lg"
          >
            Refresh
          </button>
          {index && (
            <button
              title="Previous page"
              onClick={() => {
                serachParams.set("page", index - 1);
                setSeachParams(serachParams);
              }}
              className="bg-red-500 hover:bg-red-600 text-2xl rounded-lg"
            >
              Previous page
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-2 py-2 flex justify-center flex-wrap *:w-full text-center relative">
            <nav
              className={`w-full absolute top-0 h-10 flex justify-${
                index === 1 ? "end" : "between"
              }`}
            >
              {index !== 1 && (
                <button
                  title={`Temp number ${index - 1}`}
                  onClick={() => {
                    serachParams.set("page", index - 1);
                    setSeachParams(serachParams);
                  }}
                >
                  <FaArrowLeft />
                </button>
              )}

              <button
                title={`Temp number ${index + 1}`}
                onClick={() => {
                  serachParams.set("page", index + 1);
                  setSeachParams(serachParams);
                }}
              >
                <FaArrowRight />
              </button>
            </nav>

            {trackInfo.artworkUrl100 && (
              <img
                src={proxy + trackInfo.artworkUrl100.replaceAll("100", "200")}
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
            <h2
              className="text-gray-500 dark:text-gray-400"
              title="Artist Name"
            >
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
                  <Favicon
                    domain={site}
                    size={32}
                    className="inline-block mr-1"
                  />
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
        </>
      )}
    </section>
  );
};

export default Player;
