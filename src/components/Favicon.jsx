import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

/**
 * Fetches and displays a favicon for a given domain.
 *
 * @param {Object} props - Component props.
 * @param {string} props.domain - The domain for which the favicon is fetched.
 * @param {number} [props.size=64] - The size of the favicon. Defaults to 64.
 * @param {string} [props.className] - Additional CSS classes to apply to the image.
 * @returns {JSX.Element|null} The favicon image or null if not available.
 */
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

    if (domain) {
      fetchFavicon();
    }
  }, [domain, size]);

  return faviconUrl ? (
    <img src={faviconUrl} alt="Favicon" className={`size-6 ${className}`} />
  ) : null;
};

// PropTypes validation
Favicon.propTypes = {
  domain: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default Favicon;
