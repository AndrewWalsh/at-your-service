import { SetupWorkerApi } from "msw";

import { startAtYourService } from "at-your-service";
// import { startAtYourService } from "../../src";

// const LOCALHOST_API = "http://localhost:8080";
// const SW_PATH = `${import.meta.env.BASE_URL}mockServiceWorker.js`;

const initialiseWorker = (worker: SetupWorkerApi) => {
  // await window.navigator.serviceWorker.register(SW_PATH);

  worker.start({
    findWorker(scriptUrl) {
      return scriptUrl.includes("mockServiceWorker.js");
    },
    quiet: true,
    waitUntilReady: true,
  });

  window.navigator.serviceWorker.ready.then(() => {
    startAtYourService({ registerWorker: false });
  });

  return worker;
};

let worker: SetupWorkerApi;
export default (setupWorker: SetupWorkerApi) => {
  if (worker) {
    return worker
  }
  worker = initialiseWorker(setupWorker)
  return worker
}
