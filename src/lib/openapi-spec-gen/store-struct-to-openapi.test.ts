import { test, expect } from "vitest";

import storeStructToOpenAPI from "./store-struct-to-openapi";
import { createStoreStructure } from "../../test-utils/store-structure-generator";

test("getJSON returns JSON", async () => {
  const { storeStructure } = createStoreStructure()
  const result = await storeStructToOpenAPI(storeStructure)
  expect(result.getJSON()).toBeTypeOf("string");
});

test("getYAML returns YAML", async () => {
  const { storeStructure } = createStoreStructure()
  const result = await storeStructToOpenAPI(storeStructure)
  expect(result.getYAML()).toBeTypeOf("string");
});

