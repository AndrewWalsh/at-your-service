import { test, expect } from "vitest";
import { createDummyData, createAllBlank } from "../test-utils";
import samplesToJSONSchema from "./samples-to-quicktype";
import { Sample } from "../data-types";

test("the order of elements in the first argument does not affect the output", async () => {
  const s1 = new Sample(JSON.stringify(createDummyData()));
  const s2 = new Sample(JSON.stringify(createDummyData()));
  expect(await samplesToJSONSchema([s1, s2])).toEqual(
    await samplesToJSONSchema([s2, s1])
  );
});

// Note with the below
// Converting between schemas like involes possibilities where "integer" becomes "number" etc
// So test cases more complex than the below need to resolve these types that are correct but different
test("equivalent data types have the same structure", async () => {
  const s1 = new Sample(JSON.stringify(createDummyData()));
  const s2 = new Sample(JSON.stringify(createAllBlank()));
  expect(await samplesToJSONSchema([s1, s2])).toEqual(
    await samplesToJSONSchema([s1, s1])
  );
});
