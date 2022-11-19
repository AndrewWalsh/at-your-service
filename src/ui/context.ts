import { createContext } from "react";

import { createOptionsDefaults } from "./utils";
import { Store } from "../data-types";
import type { AYSCtx } from "./types";

export const Ctx = createContext<AYSCtx>({
  store: new Store(),
  options: createOptionsDefaults(),
});
