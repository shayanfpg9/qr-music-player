import axios from "axios";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A button that triggers a file download when clicked.
 *
 * @param {Object} props - Component props.
 * @param {string} props.src - The URL of the file to download.
 * @param {string} props.filename - The filename for the downloaded file.
 * @param {React.ReactNode} props.children - The content to display inside the button.
 * @param {function} [props.onClick] - Callback function to be called on click with status ('start' or 'done').
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {Object} [props.rest] - Other props to pass to the button element.
 * @returns {JSX.Element} The rendered button component.
 */
const DownloadButton = ({
  src,
  filename,
  children,
  onClick,
  className,
  ...props
}) => {
  // const handleDownload = async () => {
  //   try {
  //     // if (typeof onClick === "function") onClick("start");

  //     // console.log(src);

  //     // const response = await axios.get(src, {
  //     //   headers: {
  //     //     "Access-Control-Allow-Origin": "*",
  //     //   },
  //     // });

  //     // if (!response.ok) {
  //     //   throw new Error(`HTTP error! Status: ${response.status}`);
  //     // }

  //     // const blob = await response.blob();
  //     // const url = URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = decodeURIComponent(src.replace(proxy, ""));
  //     link.download = filename ?? true;
  //     link.click();
  //     // URL.revokeObjectURL(url);

  //     if (typeof onClick === "function") onClick("done");
  //   } catch (error) {
  //     console.error("Error downloading the file:", error);
  //     alert("The file address is invalid");
  //     if (typeof onClick === "function") onClick("done");
  //   }
  // };



  return (
    <a href={src} download={filename || true} className={className} {...props}>
      {children}
    </a>
  );
};

// PropTypes validation
DownloadButton.propTypes = {
  src: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default DownloadButton;
