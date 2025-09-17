import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function enableMocks() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/handlers');
      await worker.start({ onUnhandledRequest: 'bypass' });
    } catch (err) {
      // If MSW isn't installed or worker fails, continue without mocks
      console.warn('[MSW] Failed to start mock worker. Continuing without mocks.', err);
    }
  }
}

enableMocks().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
