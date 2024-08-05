import PropTypes from "prop-types";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeContext } from "./context/ThemeContext";
import useTheme from "./hooks/useTheme";
import useTrack from "./hooks/useTrack";
import { TrackContext } from "./context/TrackContext";

/**
 * The main application component that provides theme and track information context.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered within the main section.
 * @returns {JSX.Element} The rendered application component.
 */
const App = ({ children }) => {
  const { theme, themeIcon, handleThemeChange } = useTheme();
  const trackInfo = useTrack();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        icon: themeIcon,
        change: handleThemeChange,
      }}
    >
      <div className={`min-h-screen flex flex-col ${theme}`}>
        <TrackContext.Provider value={trackInfo}>
          <Header />
          <main className="m-6 flex-grow flex justify-center items-center">
            {children}
          </main>
          <Footer />
        </TrackContext.Provider>
      </div>
    </ThemeContext.Provider>
  );
};

// Define prop types for the App component
App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
