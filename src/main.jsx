import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, HashRouter } from "react-router-dom";
import "./index.css";
import Player from "./Player";
import App from "./App";
import Form from "./Form";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/player/:name" element={<Player />} />
        </Routes>
      </App>
    </HashRouter>
  </React.StrictMode>
);
