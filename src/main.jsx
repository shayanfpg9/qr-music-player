import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, HashRouter } from "react-router-dom";
import "./index.css";
import Player from "./Player";
import App from "./App";
import Form from "./Form";
import ErrorElement from "./Error";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} errorElement={<ErrorElement bg code={500} />}>
          <Route index element={<Form />} />
          <Route
            path="player/:name"
            element={<Player />}
            errorElement={<ErrorElement bg code={400} />}
          />
          <Route path="*" element={<ErrorElement bg code={404} />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
