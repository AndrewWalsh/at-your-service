import { test, expect } from "vitest";

import getPathToStoreRoute from "./get-path-to-store-route";

test("converts string into expected format", async () => {
  const result = getPathToStoreRoute("host/path/name/method/status");
  expect(result).toEqual(["host", "path/name", "method", "status"]);
});
