import { test, expect } from "vitest";
import createPartName from "./create-dynamic-part-name";

type CreatePartNameParams = Parameters<typeof createPartName>;

test("returns string literal {id} when the part name is empty", async () => {
  const params: CreatePartNameParams = ["", new Set()];
  expect(createPartName(...params)).toBe("{id}");
});

test("returns {id<num>} when there is a confilict with an existing id", async () => {
  const set = new Set<string>(["{userId}", "{userId1}"]);
  const params: CreatePartNameParams = ["user", set];
  expect(createPartName(...params)).toBe("{userId2}");
});

test('returns {userId} when part is "user"', async () => {
  const set = new Set<string>();
  const params: CreatePartNameParams = ["user", set];
  expect(createPartName(...params)).toBe("{userId}");
});
