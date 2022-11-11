import { test, expect } from "vitest";

import JSONSchemaToOpenAPISchema from "./json-schema-to-openapi-schema";

import { Sample } from "../../data-types";
import samplesToJSONSchema from "../samples-to-json-schema";

const createDummyData = (varies: unknown = "varies") => ({
  string: "string",
  number: 1,
  boolean: true,
  array: [1, 2, 3],
  object: {},
  null: null,
  varies,
});

test("returns a valid OpenAPI 3.1 Schema Object for a JSON Schema drafr 4 input JSON string", async () => {
  const sample = new Sample(JSON.stringify(createDummyData()));
  const sample_two = new Sample(JSON.stringify(createDummyData(1)));

  const JSONSchema = await samplesToJSONSchema([sample, sample_two]);
  const result = await JSONSchemaToOpenAPISchema(JSONSchema);

  expect(result).toEqual({
    $defs: {
      Object: {
        additionalProperties: false,
        title: "Object",
        type: "object",
      },
      Schema: {
        additionalProperties: false,
        properties: {
          array: {
            items: {
              type: "integer",
            },
            type: "array",
          },
          boolean: {
            type: "boolean",
          },
          null: {
            type: "null",
          },
          number: {
            type: "integer",
          },
          object: {
            $ref: "#/definitions/Object",
          },
          string: {
            type: "string",
          },
          varies: {
            $ref: "#/definitions/Varies",
          },
        },
        required: [
          "array",
          "boolean",
          "null",
          "number",
          "object",
          "string",
          "varies",
        ],
        title: "Schema",
        type: "object",
      },
      Varies: {
        anyOf: [
          {
            type: "integer",
          },
          {
            type: "string",
          },
        ],
        title: "Varies",
      },
    },
    $ref: "#/$defs/Schema",
  });
});
