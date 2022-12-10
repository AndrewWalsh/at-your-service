import { test, expect, describe } from "vitest";
import { Validator } from "@seriousme/openapi-schema-validator";
import { merge, times } from "lodash";

import storeStructToOpenAPI from "./store-struct-to-openapi";
import { createStoreStructure } from "../test-utils/store-structure-generator";
import { Sample } from "../data-types";
import { ParameterObject } from "openapi3-ts";

const path = "test";
const pathname = `/{${path}}`;
const status = "s200";
const method = "get";
const JSONStr = '"some_text"';
const JSONNum = "1";
const headers = JSON.stringify({
  "content-type": "application/json",
  other: "header",
});
const expectHeaders = {
  "content-type": {
    required: true,
    schema: {
      type: "string",
    },
  },
  other: {
    required: true,
    schema: {
      type: "string",
    },
  },
};

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
    const sampleOne = new Sample(JSONStr);
    const sampleTwo = new Sample(JSONNum);

    const defaults = {
      requestBodySamples: [sampleOne, sampleTwo],
      requestHeadersSamples: [sampleOne, sampleTwo],
      responseBodySamples: [sampleOne, sampleTwo],
      responseHeadersSamples: [sampleOne, sampleTwo],
      queryParameterSamples: [sampleOne, sampleTwo],
      pathname,
      method,
      status,
    };
    const { storeStructure } = createStoreStructure(defaults);
    const result = (await storeStructToOpenAPI(storeStructure)).getSpec();
    expect(result.paths[pathname][method].parameters).toHaveLength(1);

    const validator = new Validator();
    const res = await validator.validate(result);
    expect(res.errors).toBeUndefined();
  });

  test("includes request headers", async () => {
    const sample = new Sample(JSONStr);
    const sampleHeaders = new Sample(headers);

    const defaults = {
      requestBodySamples: [sample],
      requestHeadersSamples: [sampleHeaders],
      responseBodySamples: [sample],
      responseHeadersSamples: [sample],
      queryParameterSamples: [sample],
      pathname,
      method,
      status,
    };
    const { storeStructure } = createStoreStructure(defaults);
    const result = (await storeStructToOpenAPI(storeStructure)).getSpec();
    expect(result.paths[pathname][method].parameters).toContainEqual({
      name: "content-type",
      in: "header",
      required: true,
      schema: {
        type: "string",
      },
    });

    expect(result.paths[pathname][method].parameters).toContainEqual({
      name: "other",
      in: "header",
      required: true,
      schema: {
        type: "string",
      },
    });

    const validator = new Validator();
    const res = await validator.validate(result);
    expect(res.errors).toBeUndefined();
  });

  test("includes response headers", async () => {
    const sample = new Sample(JSONStr);
    const sampleHeaders = new Sample(headers);

    const defaults = {
      requestBodySamples: [sample],
      requestHeadersSamples: [sample],
      responseBodySamples: [sample],
      responseHeadersSamples: [sampleHeaders],
      queryParameterSamples: [sample],
      pathname,
      method,
      status,
    };
    const { storeStructure } = createStoreStructure(defaults);
    const result = (await storeStructToOpenAPI(storeStructure)).getSpec();
    const responseHeaders =
      result.paths[pathname][method].responses[status.slice(1)].headers;
    expect(responseHeaders).toEqual(expectHeaders);

    const validator = new Validator();
    const res = await validator.validate(result);
    expect(res.errors).toBeUndefined();
  });

  test("includes query parameters", async () => {
    const sample = new Sample(JSONStr);
    const sampleQueryParameters = new Sample(headers);

    const defaults = {
      requestBodySamples: [sample],
      requestHeadersSamples: [sample],
      responseBodySamples: [sample],
      responseHeadersSamples: [sample],
      queryParameterSamples: [sampleQueryParameters],
      pathname,
      method,
      status,
    };
    const { storeStructure } = createStoreStructure(defaults);
    const result = (await storeStructToOpenAPI(storeStructure)).getSpec();
    const queryParameters = result.paths[pathname][method].parameters.filter(
      (p: ParameterObject) => p.in === "query"
    );
    expect(queryParameters).toHaveLength(Object.keys(expectHeaders).length);

    const validator = new Validator();
    const res = await validator.validate(result);
    expect(res.errors).toBeUndefined();
  });
});
