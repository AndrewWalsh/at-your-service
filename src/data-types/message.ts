import type { PayloadFromWorker, MessageData } from "../types";

/**
 * A message is a wrapper around a message from the worker
 * It can add additional fields, or modify existing fields
 * It does not validate the input, that happens in the schema
 */
export default class Message {
  private data: MessageData;
  constructor(payload: PayloadFromWorker) {
    const latencyMs = payload.afterRequestTime - payload.beforeRequestTime;
    const additionalFields = {
      latencyMs,
      response: {
        ...payload.response,
        status: String(payload.response.status),
      },
    };
    const data: MessageData = { ...payload, ...additionalFields };
    this.data = data;
  }

  get(): Readonly<MessageData> {
    return this.data;
  }
}
