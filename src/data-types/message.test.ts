import { test, expect } from "vitest";
import { merge } from "lodash";
import Message from "./message";
import { createPayloadFromWorker } from "../test-utils";

test("returns an object that correctly handles new fields", () => {
  const payload = createPayloadFromWorker();
  payload.afterRequestTime = 130;
  payload.beforeRequestTime = 100;
  const result = new Message(payload).get();
  const withValues = {
    latencyMs: payload.afterRequestTime - payload.beforeRequestTime,
    response: {
      status: String(payload.response.status),
    },
  };
  const withModifications = merge(result, withValues);
  expect(result).toEqual(withModifications);
});
