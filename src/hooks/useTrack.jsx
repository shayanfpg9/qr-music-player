import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useTrack = () => {
  const [trackInfo, setInfo] = useState({});
  const [downloading, setDownloading] = useState(false);
  const location = useLocation();

  const handleDownload = (status) => {
    if (status === "start") setDownloading(true);
    if (status === "done") setDownloading(false);
  };

  const setTrackInfo = (data) => {
    setInfo(data);
    window.track = data;
  };

  const response = {
    trackInfo,
    downloading,
    setInfo: setTrackInfo,
    handleDownload,
  };

  useEffect(() => {
    setTrackInfo({});
    handleDownload("done");
  }, [location]);

  return response;
};

export default useTrack;
