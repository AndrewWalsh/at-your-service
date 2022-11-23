import { test, expect, describe } from "vitest";
import { Validator } from "@seriousme/openapi-schema-validator";
import { merge, times } from "lodash";

import storeStructToOpenAPI from "./store-struct-to-openapi";
import { createStoreStructure } from "../test-utils/store-structure-generator";
import { Sample } from "../data-types";

describe("high level tests against document validity and interface behaviour", () => {
  test("getJSON returns JSON", async () => {
    const { storeStructure } = createStoreStructure();
    const result = await storeStructToOpenAPI(storeStructure);
    expect(result.getJSON()).toBeTypeOf("string");
  });

  test("getYAML returns YAML", async () => {
    const { storeStructure } = createStoreStructure();
    const result = await storeStructToOpenAPI(storeStructure);
    expect(result.getYAML()).toBeTypeOf("string");
  });

  test("getSpec returns a valid OpenAPI specification for a single sample", async () => {
    const { storeStructure } = createStoreStructure();
    const result = (await storeStructToOpenAPI(storeStructure)).getSpec();
    const validator = new Validator();
    const res = await validator.validate(result);
    expect(res.errors).toBeUndefined();
  });

  test("getSpec returns a valid OpenAPI specification for multiple samples", async () => {
    const storeStructures = times(
      100,
      () => createStoreStructure().storeStructure
    );
    const storeStructure = storeStructures.reduce(merge);

    const result = (await storeStructToOpenAPI(storeStructure)).getSpec();
    const validator = new Validator();
    const res = await validator.validate(result);
    expect(res.errors).toBeUndefined();
  });
});

describe("specific behaviour tests", () => {
  /**
   * This tests that extracted path names e.g. in /api/{name}
   * that repeat over multiple requests/responses with differing samples
   * do not end result in duplicated path names in the ParameterObject list
   */
  test("the extracted path name does not duplicate when a path has multiple samples", async () => {
    const path = "test";
    const pathname = `/{${path}}`;
    const method = "get";
    const JSONStr = '"some_text"';
    const JSONNum = "1";

    const sampleOne = new Sample(JSONStr);
    const sampleTwo = new Sample(JSONNum);

    const defaults = {
      reqSamples: [sampleOne, sampleTwo],
      resSamples: [sampleOne, sampleTwo],
      pathname,
      method,
    };
    const { storeStructure } = createStoreStructure(defaults);
    const result = (await storeStructToOpenAPI(storeStructure)).getSpec();
    expect(result.paths[pathname][method].parameters).toHaveLength(1);

    const validator = new Validator();
    const res = await validator.validate(result);
    expect(res.errors).toBeUndefined();
  });
});
