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
import { StrictEventEmitter } from "strict-event-emitter";
import { startUi } from "../ui";
import { MessageTypeFromWorker } from "../types";
import { getStore } from "../data-types";
import { validateWorkerMessage } from "../lib";
import { Message } from "../data-types";
const startOnHandler = (emitter) => {
  navigator.serviceWorker.addEventListener("message", (event) =>
    __awaiter(void 0, void 0, void 0, function* () {
      if (event.data.type !== MessageTypeFromWorker.FETCH) {
        return;
      }
      // If the message is not valid for some reason, ignore it
      // This step discards a lot of messages that we don't care about
      try {
        yield validateWorkerMessage(event.data.payload);
      } catch (_a) {
        return;
      }
      if (event.data.type === MessageTypeFromWorker.FETCH) {
        emitter.emit(MessageTypeFromWorker.FETCH, event.data);
      }
    })
  );
  return emitter;
};
function sendMessage(worker, action) {
  const messageChannel = new MessageChannel();
  return new Promise((resolve, reject) => {
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data);
    };
    try {
      worker.postMessage(action, [messageChannel.port2]);
    } catch (error) {
      reject(error);
    }
  });
}
const defaultConfig = {
  title: "API",
  registerWorker: true,
};
export default function startAtYourService(config = defaultConfig) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      if (config.registerWorker) {
        yield navigator.serviceWorker.register("./at-your-service-sw.js");
      }
      // Sometimes, things go wrong relating to dev servers
      if (config.registerWorker && !navigator.serviceWorker.controller) {
        location.reload();
        return;
      }
      const store = getStore();
      const emitter = startOnHandler(new StrictEventEmitter());
      emitter.on(MessageTypeFromWorker.FETCH, (data) => {
        store.update(new Message(data.payload));
      });
      // sendMessage(navigator.serviceWorker.controller, {
      //   type: MessageTypeToWorker.INIT_PORT,
      // });
      startUi(store);
    } catch (error) {
      console.error(
        "[at-your-service] could not start tool, did you install the service worker with 'npx at-your-service@latest <publicDir>' ?",
        error
      );
    }
  });
}
