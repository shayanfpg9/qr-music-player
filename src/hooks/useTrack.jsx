import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useTrack = () => {
  const [trackInfo, setInfo] = useState({});
  const [downloading, setDownloading] = useState(false);
  const location = useLocation();
  const response = {
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

  useEffect(() => {
    response.setInfo({});
    response.handleDownload("done")
  }, [location]);

  return response;
};

export default useTrack;
