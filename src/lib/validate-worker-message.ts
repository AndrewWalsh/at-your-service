import { messagePayloadSchema } from "../schemas";

/**
 * Validates the message received from the worker
 * Sometimes this can have a different shape, so we need to validate it
 * This also helps to discard messages that are not relevant
 */
export default async function validateWorkerMessage(data: {}) {
  try {
    const parsed = await messagePayloadSchema.validate(data);
    return parsed;
  } catch (e) {
    return Promise.reject(e);
  }
}
