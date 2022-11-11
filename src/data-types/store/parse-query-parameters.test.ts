import { test, expect } from "vitest";
import parseQueryParameters from "./parse-query-parameters";

test("is empty when input is empty", async () => {
  const qp: URLSearchParams = new URLSearchParams();
  const expected = {};
  expect(parseQueryParameters(qp)).toEqual(expected);
});

test("returns key and values", async () => {
  const qp: URLSearchParams = new URLSearchParams();
  qp.set("test", "value");
  qp.set("t 1", "t 2");
  const expected = {
    test: "value",
    "t 1": "t 2",
  };
  expect(parseQueryParameters(qp)).toEqual(expected);
});
