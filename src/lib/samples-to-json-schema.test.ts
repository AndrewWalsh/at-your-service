import { test, expect } from "vitest";

import toJSONSchema from "./samples-to-json-schema";
import { Sample } from "../data-types";

test("combines string sample into a string JSON schema", async () => {
  const objOne = {
    test: "string",
  };
  const objTwo = {
    test: 1,
  };
  const sampleOne: Sample = new Sample(JSON.stringify(objOne));
  const sampleTwo: Sample = new Sample(JSON.stringify(objTwo));
  const result = toJSONSchema([sampleOne, sampleTwo]);
  expect(result).toEqual({
    properties: {
      test: {
        type: ["integer", "string"],
      },
    },
    required: ["test"],
    type: "object",
  });
});
