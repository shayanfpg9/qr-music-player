import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Player from "./Player";
import App from "./App";
import Form from "./Form";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/player/:name" element={<Player />} />
        </Routes>
      </App>
    </BrowserRouter>
  </React.StrictMode>
);
