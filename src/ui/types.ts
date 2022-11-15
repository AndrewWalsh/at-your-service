import type { Store } from "../data-types";

export type Options = {
  buttonPosition: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
};

export type AYSCtx = {
  store: Store;
  options: Options;
};
