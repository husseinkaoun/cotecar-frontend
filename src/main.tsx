import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";      // ✅ your UI styles
// OR if you use index.css too, keep it like this:
// import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
