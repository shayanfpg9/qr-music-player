import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeContext } from "./context/ThemeContext";
import useTheme from "./hooks/useTheme";

const App = ({ children }) => {
  const { theme, themeIcon, handleThemeChange } = useTheme();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        icon: themeIcon,
        change: handleThemeChange,
      }}
    >
      <div className={`min-h-screen flex flex-col ${theme}`}>
        <Header />
        <main className="m-6 flex-grow flex justify-center *:flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
