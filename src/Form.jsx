import { useState, useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import useDocumentMeta from "./hooks/useDocumentMeta";
import { useNavigate } from "react-router-dom";

const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/\S*)?$/;
const isValidURL = (url) => {
  try {
    return urlRegex.test(url) && new URL(url);
  } catch (error) {
    return false;
  }
};

const Form = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [fromSite, setFromSite] = useState("");
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileError, setFileError] = useState(false);
  const [siteError, setSiteError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const changeMeta = useDocumentMeta();

  changeMeta({
    title: `Music player`,
    description: `QR Music player by @shayanfpg9`,
    faviconUrl: `%%/logo.svg`,
  });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setSiteError(false);
    setFileError(false);
    setNameError(false);

    if (fromSite !== "" && !isValidURL(fromSite)) {
      setSiteError(true);
    } else {
      if (name && isValidURL(fileUrl)) {
        const queryParams = new URLSearchParams({
          text: encodeURIComponent(text),
          site: encodeURIComponent(fromSite),
          from: encodeURIComponent(title),
          src: encodeURIComponent(fileUrl),
        });

        navigate(`/player/${name}/?${queryParams.toString()}`);
      } else {
        if (!isValidURL(fileUrl)) setFileError(true);
        if (!name) setNameError(true);
      }
    }
  };

  return (
    <div
      className={`p-4 min-w-[50vw] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md ${theme}`}
    >
      <h1 className="text-3xl font-bold mb-4 text-center">
        Submit Your Music Information
      </h1>

      <form className="space-y-4">
        <div>
          <label>
            Name{" "}
            {nameError && (
              <span className="text-sm animate-pulse text-red-500">
                (Input must be filled)
              </span>
            )}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
            required
          />
        </div>

        <div>
          <label>
            Text <span className="text-sm text-blue-500">(optional)</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
            placeholder="Enter text description"
          />
        </div>

        <hr />

        <div>
          <label>
            Reference site title{" "}
            <span className="text-sm text-blue-500">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter reference site title"
          />
        </div>

        <div>
          <label>
            Reference Site URL{" "}
            <span className="text-sm text-blue-500">(optional)</span>
            {" "}
            {siteError && (
              <span className="text-sm animate-pulse text-red-500">
                (Input must be a URL)
              </span>
            )}
          </label>
          <input
            type="text"
            value={fromSite}
            onChange={(e) => setFromSite(e.target.value)}
            placeholder="Enter reference Site URL (with http(s))"
          />
        </div>

        <hr />

        <div>
          <label>
            File URL{" "}
            {fileError && (
              <span className="text-sm animate-pulse text-red-500">
                (Input must be a URL)
              </span>
            )}
          </label>
          <input
            type="text"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="Enter file URL (with http(s))"
            required
          />
        </div>

        <div className="flex space-x-4 justify-center *:flex-1 ">
          <button
            onClick={(ev) => handleSubmit(ev)}
            type="submit"
            className="bg-green-500 hover:bg-green-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
