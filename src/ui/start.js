import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import { Ctx } from "./context";
import { createOptionsDefaults } from "./utils";
import App from "./App";
/**
 * buttonPosition: one of "bottomLeft", "bottomRight", "topLeft", "topRight"
 *
 * @param store A Store that can be queried at any point to get the current state of the store
 * @param options Partial options
 */
export const startUi = (store, options = createOptionsDefaults()) => {
  const id = "at-your-service-root";
  const rootEl = document.createElement("div");
  rootEl.id = id;
  rootEl.style.position = "absolute";
  rootEl.style.height = "100vh";
  rootEl.style.width = "100vw";
  rootEl.style.display = "flex";
  rootEl.style.alignItems = "end";
  rootEl.style.pointerEvents = "none";
  document.getElementsByTagName("body")[0].appendChild(rootEl);
  ReactDOM.createRoot(rootEl, { identifierPrefix: id }).render(
    _jsx(
      Ctx.Provider,
      Object.assign(
        { value: { store, options } },
        { children: _jsx("div", { children: _jsx(App, {}) }) }
      )
    )
  );
};
