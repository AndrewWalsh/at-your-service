var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { get, set, isUndefined } from "lodash";
import store2 from "store2";
import parseQueryParameters from "./parse-query-parameters";
import { Sample } from "../../data-types";
import withNamedPathParts from "./with-named-path-parts";
export const STORE_STORAGE_NAMESPACE = "at-your-service-sw-store";
/**
 * A store for messages from the worker
 * The underlying data structure is optimised for OpenAPI spec generation
 * All method operations are asynchronous by default to accommodate quicktype
 * But all read/write operations to the underlying store are synchronous
 *
 * The store backs itself up to its own namespace, on the understanding that only one instance is running at a time
 */
class Store {
  constructor() {
    Object.defineProperty(this, "store", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "localStorage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    this.localStorage = store2.namespace(STORE_STORAGE_NAMESPACE).local;
    this.store = this.getStoreStructureFromStorage();
  }
  /**
   * Deserialises the browser's storage into a StoreStructure
   * More information is in saveRouteToStorage
   */
  getStoreStructureFromStorage() {
    try {
      const all = this.localStorage.getAll();
      const out = Object.create(null);
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
        const reqSamples = route.reqSamples.map(Sample.create);
        const resSamples = route.resSamples.map(Sample.create);
        set(
          out,
          pathToStoreRoute,
          Object.assign(Object.assign({}, route), { resSamples, reqSamples })
        );
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
  saveRouteToStorage(route, pathToStoreRoute) {
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
  createFirstStoreRoute(withData) {
    const initialData = {
      parameters: parseQueryParameters(withData.url.searchParams),
      pathName: withData.pathName,
      meta: [
        {
          beforeRequestTime: withData.beforeRequestTime,
          afterRequestTime: withData.afterRequestTime,
          latencyMs: withData.latencyMs,
        },
      ],
      reqSamples: [withData.requestSample],
      resSamples: [withData.responseSample],
    };
    set(this.store, withData.pathToStoreRoute, initialData);
    return;
  }
  /**
   * Utility method for getting a path to a StoreRoute
   */
  static getPathToStoreRoute(input) {
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
  update(message) {
    return __awaiter(this, void 0, void 0, function* () {
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
      const storeRoute = get(this.store, pathToStoreRoute);
      // Create if it doesn't exist
      if (isUndefined(storeRoute)) {
        this.createFirstStoreRoute(
          Object.assign(Object.assign({}, data), {
            pathToStoreRoute,
            url,
            pathName,
            requestSample,
            responseSample,
          })
        );
      }
      // Update
      else {
        // Add new sample if it doesn't exist
        // That is to say, we need to know of it in order to construct an accurate representation
        if (
          requestSample &&
          !storeRoute.reqSamples.some(requestSample.isEqual)
        ) {
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
      const theRouteExistsNow = get(this.store, pathToStoreRoute);
      this.saveRouteToStorage(theRouteExistsNow, pathToStoreRoute);
    });
  }
  /**
   * Returns a reference to the store that cannot be mutated
   * The store should be treated as a black box, but it can be read safely
   *
   * @returns a reference to the underlying store with locked attributes
   */
  get() {
    return __awaiter(this, void 0, void 0, function* () {
      const store = this.store;
      return store;
    });
  }
}
let store = null;
/**
 * Return the message store
 * The store is a singleton, so each call returns the same store
 * The store is created when getStore is first called
 *
 * @returns the message store instance
 */
export default function getStore() {
  if (store) return store;
  store = new Store();
  return store;
}
export { Store };
