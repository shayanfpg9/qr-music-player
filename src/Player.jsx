import { useState, useEffect, useContext, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import axios from "axios";
import { ThemeContext } from "./context/ThemeContext";
import handleShare from "./script/handleshare";
import Favicon from "./components/Favicon";
import replace from "./script/replace";
import { FaArrowLeft, FaArrowRight, FaCheck, FaDownload } from "react-icons/fa";
import DownloadButton from "./components/DownloadBtn";
import { TbLoader } from "react-icons/tb";
import { TrackContext } from "./context/TrackContext";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import useDocumentMeta from "./hooks/useDocumentMeta";
import ErrorElement from "./Error";

const proxy = "https://corsproxy.io/?";

const Player = () => {
  const { setInfo, downloading, handleDownload } = useContext(TrackContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const changeMeta = useDocumentMeta();

  const [src, setSrc] = useState("");
  const name = useParams().name.replaceAll("+", " ");
  const text = decodeURIComponent(searchParams.get("text"));
  const from = decodeURIComponent(searchParams.get("from"));
  const site = decodeURIComponent(searchParams.get("site"));
  const index = +searchParams.get("page") > 1 ? +searchParams.get("page") : 1;

  const [error, setError] = useState(false);
  const [play, setPlay] = useState(false);
  const [trackInfo, setTrackInfo] = useState({});
  const [imageZoom, setImageZoom] = useState(false);
  const [volume, setVolume] = useState(1);
  const { theme } = useContext(ThemeContext);
  const mount = useRef(false);
  const [copy, setCopy] = useState(false);

  // const downloadQRCode = () => {
  //   const canvas = qrRef.current.querySelector("canvas");
  //   if (canvas) {
  //     canvas.toBlob((blob) => {
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = `${trackInfo?.trackName || "Unknown Track"}-${
  //         trackInfo.artistName || "Unknown Artist"
  //       } [${window.location.host}].png`;
  //       link.click();
  //     }, "image/png");
  //   }
  // };

  useEffect(() => {
    mount.current = false;
    setError(false);
    setPlay(false);
    setTrackInfo({});
    setInfo({});

    setSrc("");

    axios
      .get(proxy + searchParams.get("src"), {
        responseType: "blob",
      })
      .then(({ data }) => {
        const blob = new Blob([data], { type: "audio/mp3" });
        const BlobUrl = URL.createObjectURL(blob);

        // let binary = "";
        // const bytes = new Uint8Array(buffer);
        // const len = bytes.byteLength;

        // for (let i = 0; i < len; i++) {
        //   binary += String.fromCharCode(bytes[i]);
        // }

        // const base64String = "data:audio/mpeg;base64," + window.btoa(binary);

        setSrc(BlobUrl);
      })
      .catch((e) => console.error(e));
  }, [location]); // eslint-disable-line

  useEffect(() => {
    if (name) {
      axios
        .get(
          proxy +
            encodeURIComponent(
              `https://itunes.apple.com/search?term=${name}&limit=${index}`
            ),
          {
            timeout: 5000,
          }
        )
        .then((response) => {
          mount.current = true;

          if (
            response.data.results.length > 0 &&
            response.data.results[index - 1]
          ) {
            const track = response.data.results[index - 1];

            if (response.data.results.length < index) setError(true);
            if (!track.trackName) setError(true);

            setTrackInfo(track);
            setInfo({ ...track, text, src });
            setPlay(false);

            changeMeta({
              title: `Music player | ${track.trackName} - ${track.artistName}`,
              description: `${track.trackName} by ${
                track.artistName
              } in QR Music player. for "${text.replaceAll("\\n", " ")}" from ${
                from || "Anonymous"
              }`,
              faviconUrl: proxy + track.artworkUrl60,
            });
          } else {
            setError(true);
          }
        })
        .catch((e) => {
          console.log(
            proxy +
              encodeURIComponent(
                `https://itunes.apple.com/search?term=${name}&limit=${index}`
              )
          );
          mount.current = true;
          setError(true);
        });
    }
  }, [name, src, text, index]); // eslint-disable-line

  // Function to fetch image as base64
  // const getBase64Image = (url, callback) => {
  //   const img = new Image();
  //   img.crossOrigin = "Anonymous";
  //   img.onload = () => {
  //     const canvas = document.createElement("canvas");
  //     const ctx = canvas.getContext("2d");
  //     const size = Math.min(img.width, img.height); // Ensuring the image is a square
  //     const borderSize = 15; // Size of the border
  //     canvas.width = size + borderSize * 2;
  //     canvas.height = size + borderSize * 2;

  //     ctx.beginPath();
  //     ctx.arc(
  //       canvas.width / 2,
  //       canvas.height / 2,
  //       (size + borderSize) / 2,
  //       0,
  //       Math.PI * 2
  //     );
  //     ctx.closePath();
  //     ctx.fillStyle = theme !== "dark" ? "#1a202c" : "#fff";
  //     ctx.fill();

  //     // Draw the image within a circular clipping path
  //     ctx.beginPath();
  //     ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2);
  //     ctx.closePath();
  //     ctx.clip();

  //     // Drawing the image
  //     ctx.drawImage(img, borderSize, borderSize, size, size);

  //     const dataURL = canvas.toDataURL("image/png");
  //     callback(dataURL);
  //   };
  //   img.src = proxy + encodeURI(url);
  // };

  // const [logoBase64, setLogoBase64] = useState(null);

  // useEffect(() => {
  //   if (trackInfo?.artworkUrl100 && !error) {
  //     getBase64Image(
  //       trackInfo.artworkUrl100.replaceAll("100", "200"),
  //       setLogoBase64
  //     );
  //   }
  // }, [trackInfo?.artworkUrl100, error]);

  return (
    <section
      className={`p-4 max-w-xl mx-auto bg-slate-50 dark:bg-gray-900 rounded-xl shadow-md space-y-4 ${theme}`}
    >
      {(!mount.current || !src.startsWith("blob:")) && !error ? (
        <TbLoader
          size={100}
          className="animate-spin-slow text-gray-900 dark:text-white"
        />
      ) : error ? (
        <ErrorElement>
          {searchParams.get("page") && (
            <button
              title="Previous page"
              onClick={() => {
                searchParams.set("page", index - 1);
                setSearchParams(searchParams);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Previous page
            </button>
          )}
        </ErrorElement>
      ) : (
        <>
          <div className="space-y-2 py-2 flex justify-center flex-wrap *:w-full text-center relative ">
            <nav className={`w-full absolute top-0 h-10 *:*:max-md:size-8 flex justify-between`}>
              <button
                title={`Temp number ${index - 1}`}
                onClick={() => {
                  index !== 1 && searchParams.set("page", index - 1);
                  index !== 1 && setSearchParams(searchParams);
                }}
              >
                {index !== 1 && <FaArrowLeft />}
              </button>

              <button
                title={`Temp number ${index + 1}`}
                onClick={() => {
                  searchParams.set("page", index + 1);
                  setSearchParams(searchParams);
                }}
              >
                <FaArrowRight />
              </button>
            </nav>

            {trackInfo.artworkUrl100 && (
              <img
                src={proxy + encodeURIComponent(trackInfo.artworkUrl100)}
                alt="Artwork"
                className={`rounded-full !size-[10rem] transition-transform ease-in-out border-4 border-gray-900 dark:border-gray-100 ${
                  imageZoom
                    ? "zoom"
                    : play && "md:animate-bounce max-md:animate-spin-slow"
                }`}
                onMouseEnter={() => setImageZoom(true)}
                onMouseLeave={() => setImageZoom(false)}
                title="Artwork"
              />
            )}

            <h1
              className="text-3xl font-bold pt-2 text-gray-900 dark:text-white capitalize"
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
                } [${window.location.host}].mp3`}
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
            autoPlay={false}
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
                  {from ? from : site}
                </a>
              </p>
            )}
          </div>

          {/* <div ref={qrRef} className="flex max-md:flex-col max-md:space-y-4"> */}
          {/* <div className="rounded-md flex max-md:justify-center">
              <QRCodeCanvas
                value={window.shortUrl}
                size={200}
                bgColor={theme === "dark" ? "#1a202c" : "#fff"}
                fgColor={theme === "dark" ? "#ffffff" : "#000000"}
                level={"H"}
                includeMargin={true}
                imageSettings={{
                  src: logoBase64,
                  width: 50,
                  height: 50,
                }}
              />
            </div> */}

          <div className="flex flex-wrap *:w-full space-y-4 md:px-2 *:text-xl *:text-white *:rounded *:py-4">
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
              } [${window.location.host}].mp3`}
            >
              Download music
            </DownloadButton>

            {/* <button
                  onClick={downloadQRCode}
                  className="bg-green-500 hover:bg-green-600"
                  title="Download QR Code"
                >
                  Download QR Code
                </button> */}

            <button
              onClick={handleShare}
              className="bg-blue-500 hover:bg-blue-600"
              title="Share this page"
            >
              Share this page
            </button>

            <button
              onClick={() => {
                handleShare(true);
                setCopy(true);

                setTimeout(() => {
                  setCopy(false);
                }, 1500);
              }}
              className="bg-yellow-500 hover:bg-yellow-600 flex justify-center items-center"
              title="Share this page"
            >
              {!copy ? "Copy Link" : <FaCheck className="size-8" />}
            </button>
          </div>
          {/* </div> */}
        </>
      )}
    </section>
  );
};

export default Player;
