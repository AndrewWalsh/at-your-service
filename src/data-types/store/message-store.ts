import { get, set, isUndefined, zip } from "lodash";
import store2, { StoreBase } from "store2";

import type { MessageData, StoreRoute, StoreStructure } from "../../types";
import parseQueryParameters from "./parse-query-parameters";
import { Sample, Message } from "../../data-types";
import withNamedPathParts from "./with-named-path-parts";
import { getPathToStoreRoute } from "../../lib";

export const STORE_STORAGE_NAMESPACE = "at-your-service-sw-store";

const storeRouteMethods = [
  "requestBodySamples",
  "requestHeadersSamples",
  "responseBodySamples",
  "responseHeadersSamples",
  "queryParameterSamples",
] as const;

/**
 * The type of the serialised version of the store in store2
 */
interface StoreRouteSerialised
  extends Omit<
    StoreRoute,
    | "requestBodySamples"
    | "requestHeadersSamples"
    | "responseBodySamples"
    | "responseHeadersSamples"
    | "queryParameterSamples"
  > {
  requestBodySamples: Array<string>;
  requestHeadersSamples: Array<string>;
  responseBodySamples: Array<string>;
  responseHeadersSamples: Array<string>;
  queryParameterSamples: Array<string>;
}

type PathToStoreRoute = [
  host: string,
  pathname: string,
  method: string,
  status: string
];

/**
 * A store for messages from the worker
 * The underlying data structure is optimised for OpenAPI spec generation
 * All method operations are asynchronous by default to accommodate quicktype
 * But all read/write operations to the underlying store are synchronous
 *
 * The store backs itself up to its own namespace, on the understanding that only one instance is running at a time
 */
class Store {
  private store: StoreStructure;
  private localStorage: StoreBase;
  constructor() {
    this.localStorage = store2.namespace(STORE_STORAGE_NAMESPACE).local;
    this.store = this.getStoreStructureFromStorage();
  }

  /**
   * Deserialises the browser's storage into a StoreStructure
   * More information is in saveRouteToStorage
   */
  private getStoreStructureFromStorage(): StoreStructure {
    try {
      const all: { [k: string]: StoreRouteSerialised } =
        this.localStorage.getAll();
      const out: StoreStructure = {};

      for (const [path, route] of Object.entries(all)) {
        const pathToStoreRoute = getPathToStoreRoute(path);

        const initialValues: Partial<StoreRoute> = {
          ...route,
          queryParameterSamples: route.queryParameterSamples.map(Sample.create),
          requestBodySamples: route.requestBodySamples.map(Sample.create),
          requestHeadersSamples: route.requestHeadersSamples.map(Sample.create),
          responseBodySamples: route.responseBodySamples.map(Sample.create),
          responseHeadersSamples: route.responseHeadersSamples.map(
            Sample.create
          ),
        };

        set(out, pathToStoreRoute, initialValues);
      }

      return out;
    } catch (e) {
      this.localStorage.clearAll();
      // Localstorage could be blocked for various reasons
      return {};
    }
  }

  /**
   * This has to be serialised to a string, which happens because StoreRoute has a toString method
   * The key here needs to work with getting deserialised
   * For that purpose:
   * 1. Remove all whitespace
   * 2. Serialise StoreRoute to key {host}/{path}/{method}/{statusCode}
   * 3. Deserialise key as [key...].split("/")
   *    Where host [0], path [1...-2], method [-2], status [-1]
   */
  private saveRouteToStorage(
    route: StoreRoute,
    pathToStoreRoute: PathToStoreRoute
  ) {
    const path = `${pathToStoreRoute[0]}/${pathToStoreRoute
      .slice(1)
      .join("/")}`;
    this.localStorage.set(path, route, true);
  }

  /**
   * Delete all state in memory and on disk
   */
  clear() {
    this.localStorage.clearAll();
    this.store = {};
  }

  /**
   * Mutates the store, creating a new StoreRoute at location pathToStoreRoute
   *
   * @param withData an object containing fields used to create a new StoreRoute
   * @returns void
   */
  private createFirstStoreRoute(
    withData: {
      pathToStoreRoute: PathToStoreRoute;
      url: URL;
      pathname: string;
      requestBodySample: Sample;
      requestHeadersSample: Sample;
      responseBodySample: Sample;
      responseHeadersSample: Sample;
      queryParameterSample: Sample;
    } & MessageData
  ) {
    const initialData: StoreRoute = {
      pathname: withData.pathname,
      meta: [
        {
          beforeRequestTime: withData.beforeRequestTime,
          afterRequestTime: withData.afterRequestTime,
          latencyMs: withData.latencyMs,
        },
      ],
      requestBodySamples: [withData.requestBodySample],
      requestHeadersSamples: [withData.requestHeadersSample],
      responseBodySamples: [withData.responseBodySample],
      responseHeadersSamples: [withData.responseHeadersSample],
      queryParameterSamples: [withData.queryParameterSample],
    };

    set(this.store, withData.pathToStoreRoute, initialData);
    return;
  }

  /**
   * Utility method for getting a path to a StoreRoute
   */
  private static getPathToStoreRoute(input: {
    url: URL;
    method: string;
    status: string;
  }): {
    pathToStoreRoute: PathToStoreRoute;
    host: string;
    pathname: string;
    method: string;
    status: string;
  } {
    const { url, method, status } = input;
    const { host } = url;
    const pathname = withNamedPathParts(url.pathname);
    return {
      pathToStoreRoute: [host, pathname, method, status],
      host,
      pathname,
      method,
      status,
    };
  }

  /**
   * Update the store with a new request/response from the worker
   * Although the update is asynchronous, the underlying store actions are synchronous and safe
   */
  async update(message: Message): Promise<void> {
    const data = message.get();
    const status = `s${data.response.status}`;
    const url = new URL(data.request.url);
    const { pathToStoreRoute, pathname } = Store.getPathToStoreRoute({
      url,
      method: data.request.method,
      status,
    });

    const requestBodyJSON = JSON.stringify(data.request.body);
    const requestHeadersJSON = JSON.stringify(data.request.headers);
    const responseBodyJSON = JSON.stringify(data.response.body);
    const responseHeadersJSON = JSON.stringify(data.response.headers);

    const requestBodySample = new Sample(requestBodyJSON);
    const requestHeadersSample = new Sample(requestHeadersJSON);
    const responseBodySample = new Sample(responseBodyJSON);
    const responseHeadersSample = new Sample(responseHeadersJSON);
    const queryParameterSample = parseQueryParameters(url.searchParams);

    const storeRoute: undefined | StoreRoute = get(
      this.store,
      pathToStoreRoute
    );

    // Create if it doesn't exist
    if (isUndefined(storeRoute)) {
      this.createFirstStoreRoute({
        ...data,
        pathToStoreRoute,
        url,
        pathname,
        requestBodySample,
        requestHeadersSample,
        responseBodySample,
        responseHeadersSample,
        queryParameterSample,
      });
    }
    // Update
    else {
      // Add new sample if it doesn't exist
      // That is to say, we need to know of it in order to construct an accurate representation
      const allSamples = [
        requestBodySample,
        requestHeadersSample,
        responseBodySample,
        responseHeadersSample,
        queryParameterSample,
      ];

      for (let i = 0; i < allSamples.length; i++) {
        const sample = allSamples[i];
        const methodName = storeRouteMethods[i];
        if (sample && !storeRoute[methodName].some(sample.isEqual)) {
          storeRoute[methodName].push(sample);
        }
      }

      storeRoute.meta.push({
        beforeRequestTime: data.beforeRequestTime,
        afterRequestTime: data.afterRequestTime,
        latencyMs: data.latencyMs,
      });
    }

    // The route in this.store exists at this point, either created or updated
    const theRouteExistsNow: StoreRoute = get(this.store, pathToStoreRoute);
    this.saveRouteToStorage(theRouteExistsNow, pathToStoreRoute);
  }

  /**
   * Returns a reference to the store that cannot be mutated
   * The store should be treated as a black box, but it can be read safely
   *
   * @returns a reference to the underlying store with locked attributes
   */
  async get(): Promise<Readonly<StoreStructure>> {
    const store: Readonly<StoreStructure> = this.store;
    return store;
  }
}

let store: Store | null = null;
/**
 * Return the message store
 * The store is a singleton, so each call returns the same store
 * The store is created when getStore is first called
 *
 * @returns the message store instance
 */
export default function getStore(): Store {
  if (store) return store;
  store = new Store();
  return store;
}

export { Store };
