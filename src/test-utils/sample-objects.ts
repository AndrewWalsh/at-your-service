import { faker } from "@faker-js/faker";

import { Message } from "../data-types";
import type { PayloadFromWorker } from "../types";

const createPayloadFromWorkerDefaults = () => ({
  url: faker.internet.url(),
  status: faker.internet.httpStatusCode(),
  requestBody: { data: { test: "message" } } as any,
  requestHeaders: { data: { test: "message" } } as any,
  responseBody: { data: { test: "message" } } as any,
  responseHeaders: { data: { test: "message" } } as any,
  method: faker.internet.httpMethod(),
});
type CreatePayloadFromWorker = (
  values?: ReturnType<typeof createPayloadFromWorkerDefaults>
) => PayloadFromWorker;
export const createPayloadFromWorker: CreatePayloadFromWorker = (
  values = createPayloadFromWorkerDefaults()
) => {
  return {
    beforeRequestTime: faker.datatype.number({ min: Date.now() }),
    afterRequestTime: faker.datatype.number({ min: Date.now() }),
    request: {
      body: values.requestBody,
      headers: values.requestHeaders,
      method: values.method,
      url: values.url,
      referrer: null,
    },
    response: {
      body: values.responseBody,
      headers: values.responseHeaders,
      status: values.status,
      referrer: null,
      url: values.url,
      statusText: "OK",
      redirected: false,
      type: "basic",
    },
  };
};

export const createMessage = (
  values?: ReturnType<typeof createPayloadFromWorkerDefaults>
): Message => new Message(createPayloadFromWorker(values));

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
  text: '""',
  nested: {
    text: '""',
    nested: {
      text: '""',
      other_test: '""',
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
        snail: { toga: { rabbit: [[], '""', 0, {}, null, true] } },
      },
    },
  ],
});
