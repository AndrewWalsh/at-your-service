import { faker } from "@faker-js/faker";

import { Message } from "../data-types";
import type { PayloadFromWorker } from "../types";

export const createPayloadFromWorker = (): PayloadFromWorker => {
  return {
    beforeRequestTime: faker.datatype.number({ min: Date.now() }),
    afterRequestTime: faker.datatype.number({ min: Date.now() }),
    request: {
      body: { data: { test: "message" } },
      headers: { "content-type": "application/json" },
      method: faker.internet.httpMethod(),
      url: faker.internet.url(),
      referrer: null,
    },
    response: {
      body: { data: { test: "message" } },
      headers: { "content-type": "application/json" },
      status: faker.internet.httpStatusCode(),
      referrer: null,
      url: faker.internet.url(),
      statusText: "OK",
      redirected: false,
      type: "basic",
    },
  };
};

export const createMessage = (): Message =>
  new Message(createPayloadFromWorker());

export const createDummyData = () => ({
  text: "text",
  nested: {
    text: "text nested once",
    nested: {
      text: "text nested twice",
      other_test: "other text nested twice",
    },
  },
  integer: 1,
  float: 1.1,
  booleanTrue: true,
  booleanFalse: false,
  array: [1, 2, 3],
  emptyArr: [],
  objectsInArray: [
    { cat: { dog: null, cat: 1 } },
    { cat: { dog: null, cat: 1 } },
    { cat: { dog: null, cat: 1 } },
    {
      cat: {
        dog: null,
        cat: 1,
        snail: { toga: { rabbit: [1, 1, 2, "cat", false, null, [], {}] } },
      },
    },
  ],
});

// Equivalent to dummyData, but blank
// Has duplicates removed
// It's a minimal data structure for storing responses
export const createAllBlank = () => ({
  text: "",
  nested: {
    text: "",
    nested: {
      text: "",
      other_test: "",
    },
  },
  integer: 0,
  float: 0,
  booleanTrue: true,
  booleanFalse: true,
  array: [0],
  emptyArr: [],
  objectsInArray: [
    {
      cat: {
        dog: null,
        cat: 0,
      },
    },
    {
      cat: {
        dog: null,
        cat: 0,
        snail: { toga: { rabbit: ["", [], 0, {}, null, true] } },
      },
    },
  ],
});
