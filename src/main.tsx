import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { NestProvider } from "./store/NestContext";
import { ToastHost } from "./components/ui/ToastHost";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NestProvider>
        <ToastHost />
        <App />
      </NestProvider>
    </BrowserRouter>
  </StrictMode>
);