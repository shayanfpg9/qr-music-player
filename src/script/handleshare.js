const handleShare = (copy = false) => {
  const trackInfo = window.track;
  if (navigator.share && !copy) {
    navigator
      .share({
        title:
          (trackInfo?.trackName || "Unknown Track") +
          " / " +
          (trackInfo?.artistName || "Unknown Artist") +
          " - " +
          (trackInfo?.collectionName || "Unknown Collection"),
        text: trackInfo?.text || "Check out this song!",
        url: window.location.href,
      })
      .catch((error) => console.error("Error sharing:", error));
  } else {
    navigator.clipboard.writeText(window.location.href);
  }
};

export default handleShare;
