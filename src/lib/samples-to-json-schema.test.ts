import { test, expect } from "vitest";

import toJSONSchema from "./samples-to-json-schema";
import { Sample } from "../data-types";

test("combines string sample into a string JSON schema", async () => {
  const sample: Sample = new Sample('"test"');
  const result = toJSONSchema([sample]);
  expect(result).toEqual({ type: "string" });
});
