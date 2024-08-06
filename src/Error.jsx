import { useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import useDocumentMeta from "./hooks/useDocumentMeta";

/**
 * ErrorElement component to display an error page with a customizable error code, and options to navigate home or refresh.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} [props.children] - Optional additional content to be rendered below the main error message.
 * @param {number} [props.code=404] - The HTTP status code to display. Defaults to 404 if not provided.
 * @param {boolean} [props.bg=false] - Whether to display the error message with a background.
 * @returns {JSX.Element} The rendered error page component.
 */
const ErrorElement = ({ children, code = 404, bg = false }) => {
  const { theme } = useContext(ThemeContext);
  const changeMeta = useDocumentMeta();

  changeMeta({
    title: `Music player | Error ${code}`,
    description: `QR Music player by @shayanfpg9`,
    faviconUrl: `%%/logo.svg`,
  });

  return (
    <div
      id="error"
      className={
        bg
          ? `p-4 max-w-xl mx-auto bg-slate-50 dark:bg-gray-900 rounded-xl shadow-md space-y-4 ${theme}`
          : ""
      }
    >
      <span className="text-4xl text-gray-900 dark:text-white flex items-center justify-center">
        Error {code}
      </span>
      <Link title="Home" to="/" className="bg-blue-500 hover:bg-blue-600">
        Home
      </Link>
      <button
        title="Refresh"
        onClick={() => window.location.reload()}
        className="bg-yellow-500 hover:bg-yellow-600 "
      >
        Refresh
      </button>

      {children}
    </div>
  );
};

// Define prop types for the ErrorElement component
ErrorElement.propTypes = {
  children: PropTypes.node,
  code: PropTypes.number,
  bg: PropTypes.bool,
};

export default ErrorElement;
