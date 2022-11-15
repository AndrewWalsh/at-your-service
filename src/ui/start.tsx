import React from "react";
import ReactDOM from "react-dom/client";

import { Ctx } from "./context";
import { createOptionsDefaults } from "./utils";
import { Store } from "../data-types";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div />
  </React.StrictMode>
);

/**
 * buttonPosition: one of "bottomLeft", "bottomRight", "topLeft", "topRight"
 *
 * @param store A Store that can be queried at any point to get the current state of the store
 * @param options Partial options
 */
export const startUi = (
  store: Store,
  options = createOptionsDefaults()
): void => {
  const id = "at-your-service-root";
  const rootEl = document.createElement("div");
  rootEl.id = id;
  rootEl.style.position = "absolute";
  rootEl.style.height = "100vh";
  rootEl.style.width = "100vw";
  rootEl.style.display = "flex";
  rootEl.style.alignItems = "end";
  rootEl.style.pointerEvents = "none";
  const root = document.getElementsByTagName("body")[0].appendChild(rootEl);

  ReactDOM.createRoot(root, { identifierPrefix: id }).render(
    <Ctx.Provider value={{ store, options }}>
      <div>
        <App />
      </div>
    </Ctx.Provider>
  );
};
