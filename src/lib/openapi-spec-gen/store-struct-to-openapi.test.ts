import { test, expect } from "vitest";
import { Validator } from "@seriousme/openapi-schema-validator";

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

test("getSpec returns a valid OpenAPI specification for a single sample", async () => {
  const { storeStructure } = createStoreStructure()
  const result = await (await storeStructToOpenAPI(storeStructure)).getSpec()
  const validator = new Validator();
  result.openapi = "3.1.0";
  const res = await validator.validate(result);
  expect(res.errors).toBeUndefined()
});
