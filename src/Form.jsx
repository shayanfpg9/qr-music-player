import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";

const Form = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [fromSite, setFromSite] = useState("");
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (name && fileUrl) {
      const queryParams = new URLSearchParams({
        name,
        text,
        site: fromSite,
        from: title,
        src: fileUrl,
      });

      navigate(`/player/?${queryParams.toString()}`);
    }
  };

  return (
    <div
      className={`p-4 min-w-[50vw] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md ${theme}`}
    >
      <h1 className="text-3xl font-bold mb-4">Submit Your Information</h1>

      <form className="space-y-4">
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
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
            required
          />
        </div>

        <hr />

        <div>
          <label>
            Reference Site URL{" "}
            <span className="text-sm text-blue-500">(optional)</span>
          </label>
          <input
            type="text"
            value={fromSite}
            onChange={(e) => setFromSite(e.target.value)}
            placeholder="Enter reference Site URL"
            required
          />
        </div>

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
            required
          />
        </div>

        <hr />

        <div>
          <label>File URL</label>
          <input
            type="text"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="Enter file URL"
            required
          />
        </div>

        <div className="flex space-x-4 justify-center *:flex-1 ">
          <button
            type="submit"
            onClick={() => handleSubmit("create")}
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
