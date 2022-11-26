import { SetupWorkerApi } from "msw";

import { startAtYourService } from "at-your-service";
// import { startAtYourService } from "../../src";

const SW_PATH = `${import.meta.env.BASE_URL}mockServiceWorker.js`;
// window.navigator.serviceWorker.register(SW_PATH);

if (import.meta.env.BASE_URL === "/at-your-service") {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

const initialiseWorker = async (worker: SetupWorkerApi) => {
  await window.navigator.serviceWorker.register(SW_PATH);

  worker.start({
    findWorker(scriptUrl) {
      return scriptUrl.includes("mockServiceWorker.js");
    },
    quiet: true,
  });

  window.navigator.serviceWorker.ready.then(() => {
    startAtYourService({ registerWorker: false });
  });

  return worker;
};

let worker: SetupWorkerApi;
let didCall = false
export default async (setupWorker: SetupWorkerApi) => {
  if (didCall) {
    return worker
  }
  didCall = true
  worker = await initialiseWorker(setupWorker)
  return worker
}
