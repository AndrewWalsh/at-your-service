import { SetupWorkerApi } from "msw";

// import { startAtYourService } from "at-your-service";
import { startAtYourService } from "../../src";

import registerServiceWorker from "./registerServiceWorker";

const initialiseWorker = async (worker: SetupWorkerApi) => {
  const serviceWorker = await registerServiceWorker('mockServiceWorker')

  worker.start({
    quiet: true,
    onUnhandledRequest: "bypass",
    serviceWorker,
  });

  window.navigator.serviceWorker.ready.then(() => {
    startAtYourService({ registerWorker: false });
  });

  return worker;
};

let worker: SetupWorkerApi;
let didCall = false;
export default async (setupWorker: SetupWorkerApi) => {
  if (didCall) {
    return worker;
  }
  didCall = true;
  worker = await initialiseWorker(setupWorker);
  return worker;
};
