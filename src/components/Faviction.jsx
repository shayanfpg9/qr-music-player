import React, { useState, useEffect } from "react";
import axios from "axios";

const Favicon = ({ domain, size = 64, className }) => {
  const [faviconUrl, setFaviconUrl] = useState("");

  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        // Use a public CORS proxy
        const proxyUrl = "https://corsproxy.io/?";
        const response = await axios.get(
          `${proxyUrl}https://favicone.com/${new URL(domain).host}?s=${size}`,
          {
            responseType: "blob",
          }
        );
        const imageUrl = URL.createObjectURL(response.data);
        setFaviconUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching the favicon:", error);
      }
    };

    if (domain && size) {
      fetchFavicon();
    }
  }, [domain, size]);

  return faviconUrl ? (
    <img src={faviconUrl} alt="Favicon" className={"size-6 " + className} />
  ) : null;
};

export default Favicon;
