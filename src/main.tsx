import "./index.css";
import "./mocks/browser.ts";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { enableMockServiceWorker } from "./mocks/browser.ts";
import QueryProvider from "./lib/QueryProvider.tsx";

enableMockServiceWorker().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      {/* Wrap the app in react query provider */}
      <QueryProvider>
        <App />
      </QueryProvider>
    </React.StrictMode>
  );
});
