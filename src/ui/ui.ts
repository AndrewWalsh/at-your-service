import { el, mount } from "redom";
import { merge } from "lodash/fp";

import openButton from "./open-button";
import { storeStructToOpenAPI } from "../lib";
import type { Store } from "../data-types";

type Options = {
  buttonPosition: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
};

const createDefaults: () => Partial<Options> = () => ({
  buttonPosition: "bottomLeft",
});

/**
 * buttonPosition: one of "bottomLeft", "bottomRight", "topLeft", "topRight"
 *
 * @param store A Store that can be queried at any point to get the current state of the store
 * @param options Partial options
 */
export const startUi = (store: Store, options = createDefaults()) => {
  const opts = merge(createDefaults(), options);

  const button = openButton("bottomLeft");

  button.onclick = async () => {
    const spec = await (
      await storeStructToOpenAPI(await store.get())
    ).getJSON();
    navigator.clipboard.writeText(spec);
  };

  mount(document.body, button);
};
