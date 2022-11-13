import { test, expect, beforeEach, vi } from "vitest";
import store2 from "store2";
import { times, cloneDeep } from "lodash";

import { createMessage } from "../../test-utils";
import getStore, { Store, STORE_STORAGE_NAMESPACE } from "./message-store";
import { Meta, StoreStructure } from "../../types";
import type Sample from "../sample";
import Message from "../message";

const localStorage = store2.namespace(STORE_STORAGE_NAMESPACE).local;
const store = getStore();

type CreateExpected = (values: {
  host: string;
  pathname: string;
  method: string;
  status: string;
  reqSamples: Sample[];
  resSamples: Sample[];
  data: Meta;
}) => Readonly<StoreStructure>;
const createExpected: CreateExpected = ({
  host,
  pathname,
  method,
  status,
  reqSamples,
  resSamples,
  data,
}) => {
  const expected: Readonly<StoreStructure> = {
    [host]: {
      [pathname]: {
        [method]: {
          // s here is due to the status being a number & being interpreted as an array index integer
          [status]: {
            reqSamples,
            resSamples,
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

type CreateStoreStructureAndExpectedReturns = [
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
const createStoreStructureAndExpected =
  async (): Promise<CreateStoreStructureAndExpectedReturns> => {
    const message = createMessage();
    const data = message.get();
    const url = new URL(data.request.url);
    const { host, pathname } = url;
    const { method } = data.request;
    const { status } = data.response;

    await store.update(message);
    const storeStructure = await store.get();

    const expected = createExpected({
      host,
      pathname,
      method,
      status: `s${status}`,
      reqSamples: [
        storeStructure[host][pathname][method][`s${status}`].reqSamples[0],
      ],
      resSamples: [
        storeStructure[host][pathname][method][`s${status}`].resSamples[0],
      ],
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

test("default export function always returns the same instance", () => {
  // toBe not toEqual due to reference equality
  expect(store).toBe(getStore());
});

test(".get() returns the same instance", async () => {
  expect(await store.get()).toBe(await getStore().get());
});

test("updates state for a single message", async () => {
  const [storeStructure, expected] = await createStoreStructureAndExpected();
  expect(storeStructure).toEqual(expected);
});

test("updates state for multiple of the same message without duplicating values", async () => {
  const [
    storeStructure,
    expected,
    { message, store, host, pathname, method, status },
  ] = await createStoreStructureAndExpected();
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

test("restores state from client storage", async () => {
  // create a store structure that saves to local storage
  const [storeStructure] = await createStoreStructureAndExpected();

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
