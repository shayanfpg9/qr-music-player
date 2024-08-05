import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeContext } from "./context/ThemeContext";
import useTheme from "./hooks/useTheme";
import useTrack from "./hooks/useTrack";
import { TrackContext } from "./context/TrackContext";

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
          <main className="m-6 flex-grow flex justify-center *:flex-1">
            {children}
          </main>
          <Footer />
        </TrackContext.Provider>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
