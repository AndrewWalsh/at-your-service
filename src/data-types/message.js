/**
 * A message is a wrapper around a message from the worker
 * It can add additional fields, or modify existing fields
 * It does not validate the input, that happens in the schema
 */
export default class Message {
  constructor(payload) {
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    const latencyMs = payload.afterRequestTime - payload.beforeRequestTime;
    const additionalFields = {
      latencyMs,
      response: Object.assign(Object.assign({}, payload.response), {
        status: String(payload.response.status),
      }),
    };
    const data = Object.create(null);
    Object.assign(data, payload, additionalFields);
    this.data = data;
  }
  get() {
    return Object.freeze(this.data);
  }
}
