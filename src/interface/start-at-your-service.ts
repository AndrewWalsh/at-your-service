import { StrictEventEmitter } from "strict-event-emitter";
import { startUi } from "../ui";
import {
  MessageTypeToWorker,
  MessageTypeFromWorker,
  PayloadToWorker,
  FETCHFromWorker,
  EventsMap,
} from "../types";
import { getStore } from "../data-types";
import { validateWorkerMessage } from "../lib";
import { Message } from "../data-types";

const startOnHandler = (emitter: StrictEventEmitter<EventsMap>) => {
  navigator.serviceWorker.addEventListener(
    "message",
    async (event: MessageEvent<FETCHFromWorker>) => {
      // If the message is not valid for some reason, ignore it
      // This step discards a lot of messages that we don't care about
      try {
        await validateWorkerMessage(event.data.payload);
      } catch {
        return;
      }
      if (event.data.type === MessageTypeFromWorker.FETCH) {
        emitter.emit(MessageTypeFromWorker.FETCH, event.data);
      }
    }
  );
  return emitter;
};

function sendMessage(
  worker: ServiceWorker,
  action: PayloadToWorker
): Promise<string> {
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

/**
 * @namespace
 * @property {string} ApiDetails.title - The title of the specification. If there are multiple specifications, this acts as a prefix
 */
export type Config = {
  title: string;
};

const defaultConfig: Config = {
  title: "API",
};

// TODO: remember to have a cancel script here to stop the worker
// and to ensure that this cant be called twice (cancel the existing one first or something)
export default async function startAtYourService(config: Config = defaultConfig) {
  const registration = await navigator.serviceWorker.register(
    "./at-your-service-sw.js"
  );

  // Sometimes, things go wrong relating to dev servers
  if (!navigator.serviceWorker.controller) {
    location.reload();
    return;
  }

  const store = getStore();
  const emitter = startOnHandler(new StrictEventEmitter<EventsMap>());

  emitter.on(MessageTypeFromWorker.FETCH, (data) => {
    store.update(new Message(data.payload));
  });

  sendMessage(navigator.serviceWorker.controller, {
    type: MessageTypeToWorker.INIT_PORT,
  });

  startUi(store);
}
