import { test, expect } from "vitest";
import parseQueryParameters from "./parse-query-parameters";

test("is empty when input is empty", async () => {
  const qp: URLSearchParams = new URLSearchParams();
  const expected = {};
  expect(parseQueryParameters(qp).getSample()).toEqual(expected);
});

test("returns sample", async () => {
  const qp: URLSearchParams = new URLSearchParams();
  qp.set("string", "value");
  const expected = {
    string: '""',
  };
  expect(parseQueryParameters(qp).getSample()).toEqual(expected);
});
