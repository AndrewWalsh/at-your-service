import { test, expect, beforeEach } from "vitest";
import store2 from "store2";

import { STORE_STORAGE_NAMESPACE } from "./message-store";
import { createMessage } from "../../test-utils";
import getStore, { Store } from "./message-store";
import { Meta, StoreRoute, StoreStructure } from "../../types";
import type Sample from "../sample";

const localStorage = store2.namespace(STORE_STORAGE_NAMESPACE);
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

  expect(await store.get()).toEqual(expected);
});

test("restores state from storage", async () => {
  const message = createMessage();
  const data = message.get();
  const url = new URL(data.request.url);
  const { host, pathname } = url;
  const { method } = data.request;
  const { status } = data.response;

  // 1. Create the store and an expectation
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

  const key = [host, pathname, method, status].join("/");

  const storeRoute: StoreRoute = expected[host][pathname][method][`s${status}`];
  localStorage.set(key, storeRoute, true);
  localStorage.set(key + "/a", storeRoute, true);
  store.clear();
  const newStore = new Store();

  expect(await newStore.get()).toEqual(await store.get());
});
