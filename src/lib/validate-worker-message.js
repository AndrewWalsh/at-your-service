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
import { messagePayloadSchema } from "../schemas";
/**
 * Validates the message received from the worker
 * Sometimes this can have a different shape, so we need to validate it
 * This also helps to discard messages that are not relevant
 */
export default function validateWorkerMessage(data) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const parsed = yield messagePayloadSchema.validate(data);
      return parsed;
    } catch (e) {
      return Promise.reject(e);
    }
  });
}
