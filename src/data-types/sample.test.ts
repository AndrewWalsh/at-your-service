import { noop } from "lodash";
import { test, expect, afterEach } from "vitest";
import { createDummyData, createAllBlank } from "../test-utils";
import Sample from "./sample";

let dummyData = createDummyData();
let allBlank = createAllBlank();
const initialConsoleWarn = console.warn;
const initialConsoleError = console.error;
afterEach(() => {
  dummyData = createDummyData();
  allBlank = createAllBlank();
  console.warn = initialConsoleWarn;
  console.error = initialConsoleError;
});

test("getSample blanks all fields in the underlying struct to a zero value", () => {
  JSON.stringify(dummyData);
  const result = new Sample(JSON.stringify(dummyData)).getSample();
  expect(allBlank).toEqual(result);
});

test("create creates a new sample", () => {
  const sample = Sample.create(JSON.stringify(dummyData)).getSample();
  expect(Object.keys(sample).length).toBeGreaterThan(0);
});

const equalSampleCases = [
  [
    new Sample(JSON.stringify(dummyData)),
    new Sample(JSON.stringify(dummyData)),
  ],
  [new Sample(JSON.stringify(allBlank)), new Sample(JSON.stringify(allBlank))],
];

test.each(equalSampleCases)(
  "isEqual returns true when samples are equal",
  (a, b) => {
    expect(a.isEqual(b)).toBe(true);
  }
);

const unequalSampleCases = [
  [
    new Sample(JSON.stringify(dummyData)),
    new Sample(JSON.stringify({ test: 1 })),
  ],
  [
    new Sample(JSON.stringify(allBlank)),
    new Sample(JSON.stringify({ test: 2 })),
  ],
];

test.each(unequalSampleCases)(
  "isEqual returns false when samples are not equal",
  (a, b) => {
    expect(a.isEqual(b)).toBe(false);
  }
);

test("isEqual preserves the context of the this keyword", () => {
  const sample = new Sample(JSON.stringify(dummyData));
  const sampleList = [sample, sample, sample];
  expect(sampleList.every(sample.isEqual)).toBe(true);
});

test("toJSON returns a JSON representation of the underlying sample", () => {
  const sample = new Sample(JSON.stringify(dummyData));
  expect(sample.toJSON()).toBe(JSON.stringify(allBlank));
});

test("returns its JSON representation when toString is called", () => {
  const sample = new Sample(JSON.stringify(dummyData));
  expect(String(sample)).toBe(JSON.stringify(allBlank));
});

test("resolves to an empty sample when instantiated with invalid JSON", () => {
  console.warn = noop;
  console.error = noop;
  const sample = new Sample("a");
  expect(sample.getSample()).toEqual({});
});

test("handles JSON string primitive", () => {
  const validJSON = '"test"';
  const sample = new Sample(validJSON);
  expect(sample.getSample()).toBe('""');
});

test("handles JSON boolean primitive", () => {
  const validJSON = "false";
  const sample = new Sample(validJSON);
  expect(sample.getSample()).toBe(true);
});

test("handles JSON number primitive", () => {
  const validJSON = "1";
  const sample = new Sample(validJSON);
  expect(sample.getSample()).toBe(0);
});

test("handles JSON null primitive", () => {
  const validJSON = "null";
  const sample = new Sample(validJSON);
  expect(sample.getSample()).toBeNull();
});

test("handles array of JSON primitives", () => {
  const validJSON = '[false, 1, "test", null, { "test": 1 }]';
  const sample = new Sample(validJSON);
  expect(sample.getSample()).toEqual([true, 0, '""', null, { test: 0 }]);
});

test("handles object of JSON primitives", () => {
  const validJSON =
    '{ "str": "test", "num": 1, "bool": false, "null": null, "obj": { "test": 1 }, "arr": [1] }';
  const sample = new Sample(validJSON);
  expect(sample.getSample()).toEqual({
    str: '""',
    num: 0,
    bool: true,
    null: null,
    obj: { test: 0 },
    arr: [0],
  });
});
