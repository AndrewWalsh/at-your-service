import { test, expect } from "vitest";
import { createDummyData, createAllBlank } from "../test-utils";
import samplesToQuicktype from "./samples-to-quicktype";
import { Sample } from "../data-types";
import { QuicktypeTargetLanguageNames } from "../types";

test("the order of elements in the first argument does not affect the output", async () => {
  const s1 = new Sample(JSON.stringify(createDummyData()));
  const s2 = new Sample(JSON.stringify(createDummyData()));
  expect(await samplesToQuicktype([s1, s2])).toEqual(
    await samplesToQuicktype([s2, s1])
  );
});

// Note with the below
// Converting between schemas like involes possibilities where "integer" becomes "number" etc
// So test cases more complex than the below need to resolve these types that are correct but different
test("equivalent data types have the same structure", async () => {
  const s1 = new Sample(JSON.stringify(createDummyData()));
  const s2 = new Sample(JSON.stringify(createAllBlank()));
  expect(await samplesToQuicktype([s1, s2])).toEqual(
    await samplesToQuicktype([s1, s1])
  );
});

test("abc", async () => {
  const s1 = new Sample(JSON.stringify(createDummyData()));
  const s2 = new Sample(JSON.stringify(createAllBlank()));
  expect(await samplesToQuicktype([s1, s2], QuicktypeTargetLanguageNames.TypeScript)).toEqual(
   ""
  );
});

