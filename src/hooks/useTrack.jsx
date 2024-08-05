import { useState } from "react";

const useTrack = () => {
  const [trackInfo, setInfo] = useState({});
  const [downloading, setDownloading] = useState(false);

  return {
    trackInfo,
    downloading,
    setInfo: (data) => {
      setInfo(data);
      window.track = data;
    },
    handleDownload: (status) => {
      if (status === "start") setDownloading(true);
      if (status === "done") setDownloading(false);
    },
  };
};

export default useTrack;
