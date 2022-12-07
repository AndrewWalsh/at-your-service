import ReactDOM from "react-dom/client";

import { Ctx } from "./context";
import { createOptionsDefaults } from "./utils";
import { Store } from "../data-types";
import App from "./App";

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
  rootEl.style.position = "fixed";
  rootEl.style.bottom = "0";
  rootEl.style.display = "flex";
  rootEl.style.alignItems = "end";
  rootEl.style.pointerEvents = "none";
  rootEl.style.zIndex = "999";
  document.getElementsByTagName("body")[0].appendChild(rootEl);

  ReactDOM.createRoot(rootEl, { identifierPrefix: id }).render(
    <Ctx.Provider value={{ store, options }}>
      <div>
        <App />
      </div>
    </Ctx.Provider>
  );
};
