import { test, expect, beforeEach, vi, describe } from "vitest";
import store2 from "store2";
import { times, cloneDeep, get } from "lodash";

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
  requestBodySamples: Array<Sample>;
  requestHeadersSamples: Array<Sample>;
  responseBodySamples: Array<Sample>;
  responseHeadersSamples: Array<Sample>;
  queryParamSamples: Array<Sample>;
  data: Meta;
}) => Readonly<StoreStructure>;
const createExpected: CreateExpected = ({
  host,
  pathname,
  method,
  status,
  requestBodySamples,
  requestHeadersSamples,
  responseBodySamples,
  responseHeadersSamples,
  queryParamSamples,
  data,
}) => {
  const expected: Readonly<StoreStructure> = {
    [host]: {
      [pathname]: {
        [method]: {
          // s here is due to the status being a number & being interpreted as an array index integer
          [status]: {
            requestBodySamples,
            requestHeadersSamples,
            responseBodySamples,
            responseHeadersSamples,
            meta: [
              {
                beforeRequestTime: data.beforeRequestTime,
                afterRequestTime: data.afterRequestTime,
                latencyMs: data.latencyMs,
              },
            ],
            queryParameterSamples: queryParamSamples,
            pathname: "/",
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

  const requestBodySamples = storeRoute.requestBodySamples.length
    ? [...storeRoute.requestBodySamples]
    : [];
  const requestHeadersSamples = storeRoute.requestHeadersSamples.length
    ? [...storeRoute.requestHeadersSamples]
    : [];

  const responseBodySamples = storeRoute.responseBodySamples.length
    ? [...storeRoute.responseBodySamples]
    : [];
  const responseHeadersSamples = storeRoute.responseHeadersSamples.length
    ? [...storeRoute.responseHeadersSamples]
    : [];

  const queryParamSamples = storeRoute.queryParameterSamples.length
    ? [...storeRoute.queryParameterSamples]
    : [];

  const expected = createExpected({
    host,
    pathname,
    method,
    status: statusPrepended,
    queryParamSamples,
    requestBodySamples,
    requestHeadersSamples,
    responseBodySamples,
    responseHeadersSamples,
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
    const [_, storeStructure] =
      await createStoreStructureAndExpectedForSingleMessage();

    // create a new store instance that loads from local storage
    const newStore = new Store();
    const newStoreStructure = await newStore.get();

    const serializer = (s: StoreStructure) => JSON.parse(JSON.stringify(s));

    expect(serializer(newStoreStructure)).toEqual(serializer(storeStructure));
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
        | "requestBodySamples"
        | "requestHeadersSamples"
        | "responseBodySamples"
        | "responseHeadersSamples"
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
      "requestBodySamples",
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
      "requestHeadersSamples",
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
      "responseBodySamples",
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
      "responseHeadersSamples",
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

describe("updates to query parameters", () => {
  test("stores new query parameters, and updates to them", async () => {
    const url = new URL("https://example.com/api?test=1");

    const values = {
      url: new URL("https://example.com/api").href,
      status: 200,
      requestBody: null,
      requestHeaders: null,
      responseBody: null,
      responseHeaders: null,
      method: "GET" as const,
    };

    const messages = [
      createMessage(values),
      createMessage({ ...values, url: `${values.url}?test="a"` }),
      createMessage({ ...values, url: `${values.url}?test=1` }),
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

    const expectSamples = [{}, { test: '""' }];

    expect(storeRoute.queryParameterSamples.map((s) => s.getSample())).toEqual(
      expectSamples
    );
  });
});
