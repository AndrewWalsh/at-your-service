import { test, expect, beforeEach } from "vitest";
import type { PartialDeep } from "type-fest";

import { PayloadFromWorker } from "../types";
import { createPayloadFromWorker } from "../test-utils";
import transformWorkerMessages from "./validate-worker-message";

let data: PartialDeep<PayloadFromWorker>;
beforeEach(() => {
  data = createPayloadFromWorker();
});

test("resolves and returns data when data is valid", async () => {
  const result = await transformWorkerMessages(data);
  expect(result).toEqual(data);
});

test("rejects and throws when data is invalid", async () => {
  delete data.request?.url;
  return expect(transformWorkerMessages(data)).rejects.toThrow();
});
