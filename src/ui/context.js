import { createContext } from "react";
import { createOptionsDefaults } from "./utils";
import { Store } from "../data-types";
export const Ctx = createContext({
  store: new Store(),
  options: createOptionsDefaults(),
});
