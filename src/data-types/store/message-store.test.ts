import { test, expect, beforeEach, vi, describe } from "vitest";
import store2 from "store2";
import { times, cloneDeep, get, difference } from "lodash";

import { createMessage } from "../../test-utils";
import getStore, { Store, STORE_STORAGE_NAMESPACE } from "./message-store";
import { Meta, StoreStructure } from "../../types";
import Sample from "../sample";
import Message from "../message";

const localStorage = store2.namespace(STORE_STORAGE_NAMESPACE).local;
const store = getStore();

type CreateExpected = (values: {
  host: string;
  pathname: string;
  method: string;
  status: string;
  reqBodySamples: Sample[];
  reqHeadersSamples: Sample[];
  resBodySamples: Sample[];
  resHeadersSamples: Sample[];
  data: Meta;
}) => Readonly<StoreStructure>;
const createExpected: CreateExpected = ({
  host,
  pathname,
  method,
  status,
  reqBodySamples,
  reqHeadersSamples,
  resBodySamples,
  resHeadersSamples,
  data,
}) => {
  const expected: Readonly<StoreStructure> = {
    [host]: {
      [pathname]: {
        [method]: {
          // s here is due to the status being a number & being interpreted as an array index integer
          [status]: {
            reqBodySamples,
            reqHeadersSamples,
            resBodySamples,
            resHeadersSamples,
            meta: [
              {
                beforeRequestTime: data.beforeRequestTime,
                afterRequestTime: data.afterRequestTime,
                latencyMs: data.latencyMs,
              },
            ],
            parameters: {},
            pathName: "/",
          },
        },
      },
    },
  };
  return expected;
};

type CreateStoreStructureAndExpectedForSingleMessageReturns = [
  ss: StoreStructure,
  ex: Readonly<StoreStructure>,
  meta: {
    host: string;
    pathname: string;
    method: string;
    status: string;
    message: Message;
    store: Store;
  }
];
const createStoreStructureAndExpectedForSingleMessage = async (
  message = createMessage()
): Promise<CreateStoreStructureAndExpectedForSingleMessageReturns> => {
  const data = message.get();
  const url = new URL(data.request.url);
  const { host, pathname } = url;
  const { method } = data.request;
  const { status } = data.response;
  const statusPrepended = `s${status}`;

  await store.update(message);
  const storeStructure = await store.get();
  const storeRoute = storeStructure[host][pathname][method][statusPrepended];

  const reqBodySamples = storeRoute.reqBodySamples.length
    ? [...storeRoute.reqBodySamples]
    : [];
  const reqHeadersSamples = storeRoute.reqHeadersSamples.length
    ? [...storeRoute.reqHeadersSamples]
    : [];

  const resBodySamples = storeRoute.resBodySamples.length
    ? [...storeRoute.resBodySamples]
    : [];
  const resHeadersSamples = storeRoute.resHeadersSamples.length
    ? [...storeRoute.resHeadersSamples]
    : [];

  const expected = createExpected({
    host,
    pathname,
    method,
    status: statusPrepended,
    reqBodySamples,
    reqHeadersSamples,
    resBodySamples,
    resHeadersSamples,
    data,
  });

  return [
    storeStructure,
    expected,
    { host, pathname, method, status, message, store },
  ];
};

beforeEach(() => {
  localStorage.clearAll();
  store.clear();
});

describe("singleton behaviour", () => {
  test("default export function always returns the same instance", () => {
    // toBe not toEqual due to reference equality
    expect(store).toBe(getStore());
  });

  test(".get() returns the same instance", async () => {
    expect(await store.get()).toBe(await getStore().get());
  });
});

describe("updates with a single request/response type", () => {
  test("updates state for a single message", async () => {
    const [storeStructure, expected] =
      await createStoreStructureAndExpectedForSingleMessage();
    expect(storeStructure).toEqual(expected);
  });

  test("updates state for a single message where the request body is undefined", async () => {
    const message = createMessage();
    // @ts-expect-error
    message.data.request.body = null;
    const [storeStructure, expected] =
      await createStoreStructureAndExpectedForSingleMessage(message);
    expect(storeStructure).toEqual(expected);
  });

  test("updates state for a single message where the response body is undefined", async () => {
    const message = createMessage();
    // @ts-expect-error
    message.data.response.body = null;
    const [storeStructure, expected] =
      await createStoreStructureAndExpectedForSingleMessage(message);
    expect(storeStructure).toEqual(expected);
  });

  test("updates state for multiple of the same message without duplicating values", async () => {
    const [
      storeStructure,
      expected,
      { message, store, host, pathname, method, status },
    ] = await createStoreStructureAndExpectedForSingleMessage();
    const prependStatus = "s" + status;
    times(10, () => store.update(message));

    // Copy meta array from storeStructure to expected, as this includes additional updates
    // Beyond this though, the storeStructure should be the same as the expected
    expected[host][pathname][method][prependStatus].meta = cloneDeep(
      storeStructure[host][pathname][method][prependStatus].meta
    );

    expect(storeStructure).toEqual(expected);
    expect(
      storeStructure[host][pathname][method][prependStatus].meta.length
    ).toBe(11);
  });
});

describe("persistence to and hydration from client storage", () => {
  test("restores state from client storage", async () => {
    // create a store structure that saves to local storage
    const [storeStructure] =
      await createStoreStructureAndExpectedForSingleMessage();

    // create a new store instance that loads from local storage
    const newStore = new Store();
    const newStoreStructure = await newStore.get();

    expect(JSON.stringify(newStoreStructure)).toEqual(
      JSON.stringify(storeStructure)
    );
  });

  test("if client storage is not available or in an invalid format, clears and uses a default value", async () => {
    localStorage.set(`${STORE_STORAGE_NAMESPACE}.some_key`, { invalid: null });
    localStorage.clearAll = vi.fn();

    const newStore = new Store();
    const newStoreStructure = await newStore.get();

    expect(newStoreStructure).toEqual({});
    expect(localStorage.clearAll).toHaveBeenCalled();
    expect(localStorage.clearAll).toHaveBeenCalledTimes(1);
  });
});

describe("updates with multiple request/response types", () => {
  const sampleTests: Array<
    [
      string,
      URL,
      {
        url: string;
        status: number;
        requestBody: string | null;
        requestHeaders: string | null;
        responseBody: string | null;
        responseHeaders: string | null;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      },
      (
        | "reqBodySamples"
        | "reqHeadersSamples"
        | "resBodySamples"
        | "resHeadersSamples"
      ),
      "requestBody" | "requestHeaders" | "responseBody" | "responseHeaders"
    ]
  > = [
    [
      "stores new request body samples when different",
      new URL("https://example.com/api"),
      {
        url: new URL("https://example.com/api").href,
        status: 200,
        requestBody: "test",
        requestHeaders: null,
        responseBody: null,
        responseHeaders: null,
        method: "GET" as const,
      },
      "reqBodySamples",
      "requestBody",
    ],
    [
      "stores new request headers samples when different",
      new URL("https://example.com/api"),
      {
        url: new URL("https://example.com/api").href,
        status: 200,
        requestBody: null,
        requestHeaders: "test",
        responseBody: null,
        responseHeaders: null,
        method: "GET" as const,
      },
      "reqHeadersSamples",
      "requestHeaders",
    ],
    [
      "stores new response body samples when different",
      new URL("https://example.com/api"),
      {
        url: new URL("https://example.com/api").href,
        status: 200,
        requestBody: null,
        requestHeaders: null,
        responseBody: "test",
        responseHeaders: null,
        method: "GET" as const,
      },
      "resBodySamples",
      "responseBody",
    ],
    [
      "stores new response headers samples when different",
      new URL("https://example.com/api"),
      {
        url: new URL("https://example.com/api").href,
        status: 200,
        requestBody: null,
        requestHeaders: null,
        responseBody: null,
        responseHeaders: "test",
        method: "GET" as const,
      },
      "resHeadersSamples",
      "responseHeaders",
    ],
  ];

  test.each(sampleTests)("%s", async (_, url, values, method, messageType) => {
    const messages = [
      createMessage(values),
      createMessage({ ...values, [messageType]: 1 }),
      createMessage({ ...values, [messageType]: null }),
      createMessage({ ...values, [messageType]: false }),
      // Along with duplicates, we still expect flat values
      createMessage(values),
      createMessage({ ...values, [messageType]: 1 }),
      createMessage({ ...values, [messageType]: null }),
      createMessage({ ...values, [messageType]: false }),
    ];

    for (const message of messages) {
      await store.update(message);
    }
    const storeStructure = await store.get();
    // @ts-expect-error
    const { pathToStoreRoute } = Store.getPathToStoreRoute({
      url,
      method: values.method,
      status: `s${values.status}`,
    });
    const storeRoute = get(storeStructure, pathToStoreRoute);

    const expectSamples = ['""', 0, null, true];

    expect(storeRoute[method].map((s) => s.getSample())).toEqual(expectSamples);
  });
});
