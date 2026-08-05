import React, { StrictMode, startTransition } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

startTransition(() => {
  const rootEl = document.getElementById("root");
  if (rootEl && rootEl.innerHTML.trim().length > 0) {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>
    );
  } else {
    const container = rootEl || document.body;
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <StartClient />
      </StrictMode>
    );
  }
});
