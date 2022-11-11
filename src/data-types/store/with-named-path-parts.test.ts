import { test, expect } from "vitest";
import withNamedPathParts from "./with-named-path-parts";

test("replaces UUIDs with the previous part name", async () => {
  const pathname = "/api/user/ec6b0caa-ee57-41b9-9810-c996c34f260a/post/new";
  expect(withNamedPathParts(pathname)).toBe("/api/user/{userId}/post/new");
});

test("uses {id} as the id when there is no preexisting id", async () => {
  const pathname = "/ec6b0caa-ee57-41b9-9810-c996c34f260a/post/new";
  expect(withNamedPathParts(pathname)).toBe("/{id}/post/new");
});

test("does not duplicate ids", async () => {
  const pathname =
    "/api/ec6b0caa-ee57-41b9-9810-c996c34f260a/ec6b0caa-ee57-41b9-9810-c996c34f260a/post/new";
  expect(withNamedPathParts(pathname)).toBe("/api/{apiId}/{apiId1}/post/new");
});

test("returns the original string if no pattern is identified", async () => {
  // Note that this UUID is not valid, it is missing one character at the end
  const pathname = "/api/user/ec6b0caa-ee57-41b9-9810-c996c34f260/post/new";
  expect(withNamedPathParts(pathname)).toBe(
    "/api/user/ec6b0caa-ee57-41b9-9810-c996c34f260/post/new"
  );
});
