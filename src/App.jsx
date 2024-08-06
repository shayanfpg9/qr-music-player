import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeContext } from "./context/ThemeContext";
import useTheme from "./hooks/useTheme";
import useTrack from "./hooks/useTrack";
import { TrackContext } from "./context/TrackContext";
import { Outlet } from "react-router-dom";

/**
 * The main application component that provides theme and track information context.
 *
 * @returns {JSX.Element} The rendered application component.
 */
const App = () => {
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
            <Outlet />
          </main>
          <Footer />
        </TrackContext.Provider>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
