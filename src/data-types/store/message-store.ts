import { get, set, isUndefined } from "lodash";
import store2, { StoreBase } from "store2";

import type { MessageData, StoreRoute, StoreStructure } from "../../types";
import parseQueryParameters from "./parse-query-parameters";
import { Sample, Message } from "../../data-types";
import withNamedPathParts from "./with-named-path-parts";

export const STORE_STORAGE_NAMESPACE = "at-your-service-sw-store";

/**
 * The type of the serialised version of the store in store2
 */
interface StoreRouteSerialised
  extends Omit<StoreRoute, "reqSamples" | "resSamples"> {
  reqSamples: Array<string>;
  resSamples: Array<string>;
}

type PathToStoreRoute = [
  host: string,
  pathName: string,
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
      const out: StoreStructure = Object.create(null);

      for (const [path, route] of Object.entries(all)) {
        const splitPath = path.split("/");
        // This magic is based on how the pathToStoreRoute is saved to storage
        // Keys look something like localhost:8080/requires/{requiresId}/info/GET/200
        // {host}/{path}/{method}/{statusCode}
        const host = splitPath[0];
        const fullPath = splitPath.slice(1, -2).join("/");
        const method = splitPath[splitPath.length - 2];
        const status = splitPath[splitPath.length - 1];
        const pathToStoreRoute = [host, fullPath, method, status];

        const resSamples = route.resSamples.map(Sample.create);

        set(out, pathToStoreRoute, { ...route, resSamples });
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
      pathName: string;
      responseSample?: Sample;
      requestSample?: Sample;
    } & MessageData
  ) {
    const initialData: StoreRoute = {
      parameters: parseQueryParameters(withData.url.searchParams),
      pathName: withData.pathName,
      meta: [
        {
          beforeRequestTime: withData.beforeRequestTime,
          afterRequestTime: withData.afterRequestTime,
          latencyMs: withData.latencyMs,
        },
      ],
      reqSamples: withData.requestSample ? [withData.requestSample] : [],
      resSamples: withData.responseSample ? [withData.responseSample] : [],
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
    pathName: string;
    method: string;
    status: string;
  } {
    const { url, method, status } = input;
    const { host } = url;
    const pathName = withNamedPathParts(url.pathname);
    return {
      pathToStoreRoute: [host, pathName, method, status],
      host,
      pathName,
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
    const { pathToStoreRoute, pathName } = Store.getPathToStoreRoute({
      url,
      method: data.request.method,
      status,
    });

    const requestJSON = JSON.stringify(data.request.body);
    const responseJSON = JSON.stringify(data.response.body);

    const requestSample = new Sample(requestJSON);
    const responseSample = new Sample(responseJSON);

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
        pathName,
        requestSample,
        responseSample,
      });
    }
    // Update
    else {
      // Add new sample if it doesn't exist
      // That is to say, we need to know of it in order to construct an accurate representation
      if (requestSample && !storeRoute.reqSamples.some(requestSample.isEqual)) {
        storeRoute.reqSamples.push(requestSample);
      }
      if (
        responseSample &&
        !storeRoute.resSamples.some(responseSample.isEqual)
      ) {
        storeRoute.resSamples.push(responseSample);
      }
      storeRoute.meta.push({
        beforeRequestTime: data.beforeRequestTime,
        afterRequestTime: data.afterRequestTime,
        latencyMs: data.latencyMs,
      });
    }

    // The route in this.store exists at this point, either created or updated
    const theRouteExistsNow: StoreRoute = get(this.store, pathToStoreRoute);
    if (!theRouteExistsNow) {
      throw new Error("Something went wrong in the store, route should exist");
    }
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
