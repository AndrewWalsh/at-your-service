import { SetupWorkerApi } from "msw";

// import { startAtYourService } from "at-your-service";
import { startAtYourService } from "../../src";

import registerServiceWorker from "./registerServiceWorker";

const initialiseWorker = async (worker: SetupWorkerApi) => {
  const serviceWorker = await registerServiceWorker('mockServiceWorker')
  // if (navigator.serviceWorker.controller) {
  //   await navigator.serviceWorker
  //     .getRegistration("./mockServiceWorker.js")
  //     .then(function (sw) {
  //       if (sw) {
  //         return sw
  //           .unregister()
  //           .then(() =>
  //             navigator.serviceWorker.register("./mockServiceWorker.js", {
  //               scope: "./",
  //             })
  //           );
  //       }
  //     });
  // }
  
  // navigator.serviceWorker.getRegistration().then(function(reg) {
  //   // There's an active SW, but no controller for this tab.
  //   if (reg?.active && !navigator.serviceWorker.controller) {
  //     // Perform a soft reload to load everything from the SW and get
  //     // a consistent set of resources.
  //     window.location.reload();
  //   }
  // });

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
