import { base } from "../../config.json";

const useDocumentMeta = () => {
  const change = ({ title, description, faviconUrl }) => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDescription = document.querySelector("meta[name='description']");
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      } else {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        metaDescription.content = description;
        document.head.appendChild(metaDescription);
      }
    }

    faviconUrl = faviconUrl.replaceAll("%%", location.origin + base);

    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  };

  return change;
};

export default useDocumentMeta;
