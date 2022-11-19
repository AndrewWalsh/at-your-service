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

test("exports interface matching expectations", async () => {
  const s1 = new Sample(JSON.stringify(createDummyData()));
  const s2 = new Sample(JSON.stringify(createAllBlank()));
  const expectStr = `export interface Body {
    array:          number[];
    booleanFalse:   boolean;
    booleanTrue:    boolean;
    emptyArr:       any[];
    float:          number;
    integer:        number;
    nested:         BodyNested;
    objectsInArray: ObjectsInArray[];
    text:           string;
}

export interface BodyNested {
    nested: NestedNested;
    text:   string;
}

export interface NestedNested {
    other_test: string;
    text:       string;
}

export interface ObjectsInArray {
    cat: Cat;
}

export interface Cat {
    cat:    number;
    dog:    null;
    snail?: Snail;
}

export interface Snail {
    toga: Toga;
}

export interface Toga {
    rabbit: Array<any[] | boolean | RabbitClass | number | null | string>;
}

export interface RabbitClass {
}
`
  expect(await samplesToQuicktype([s1, s2], QuicktypeTargetLanguageNames.TypeScript)).toEqual(expectStr);
});

