import React from "react";

const DownloadButton = ({
  src,
  filename,
  children,
  onClick,
  className,
  ...props
}) => {
  const handleDownload = async () => {
    try {
      if (typeof onClick === "function") onClick("start");
      const response = await fetch("https://corsproxy.io/?" + src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (typeof onClick === "function") onClick("done");
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <button onClick={handleDownload} className={className} {...props}>
      {children}
    </button>
  );
};

export default DownloadButton;
