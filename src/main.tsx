import "./index.css";
import App from "./app/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerServiceWorkerUpdates } from "@/lib/offline/swUpdate";

registerServiceWorkerUpdates();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
