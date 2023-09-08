import { StrictEventEmitter } from "strict-event-emitter";
import { startUi } from "../ui";
import {
  MessageTypeFromWorker,
  PayloadToWorker,
  FETCHFromWorker,
  EventsMap,
  MessageTypeToWorker,
} from "../types";
import { getStore } from "../data-types";
import { validateWorkerMessage } from "../lib";
import { Message } from "../data-types";

const startOnHandler = (emitter: StrictEventEmitter<EventsMap>) => {
  navigator.serviceWorker.addEventListener(
    "message",
    async (event: MessageEvent<FETCHFromWorker>) => {
      if (event.data.type !== MessageTypeFromWorker.FETCH) {
        return;
      }
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

export type Config = {
  title: string;
  registerWorker: boolean;
};

const defaultConfig: Config = {
  title: "API",
  registerWorker: true,
};

export default async function startAtYourService(
  config: Partial<Config> = defaultConfig
) {
  try {
    if (config.registerWorker) {
      await navigator.serviceWorker.register("./at-your-service-sw.js");
    }

    // Sometimes, things go wrong relating to dev servers
    if (config.registerWorker && !navigator.serviceWorker.controller) {
      location.reload();
      return;
    }

    const store = getStore();
    const emitter = startOnHandler(new StrictEventEmitter<EventsMap>());

    emitter.on(MessageTypeFromWorker.FETCH, (data) => {
      store.update(new Message(data.payload));
    });

    window.setInterval(() => {
      sendMessage(navigator.serviceWorker.controller, {
        type: MessageTypeToWorker.KEEPALIVE_REQUEST,
      });
    }, 5000);

    startUi(store);
  } catch (error) {
    console.error(
      "[at-your-service] could not start tool, did you install the service worker with 'npx at-your-service@latest <publicDir>' ?",
      error
    );
  }
}
