import { SetupWorkerApi } from "msw";

import { startAtYourService } from "at-your-service";
// import { startAtYourService } from "../../src";

const initialiseWorker = async (worker: SetupWorkerApi) => {
  worker.start({
    quiet: true,
    onUnhandledRequest: "bypass",
  });

  startAtYourService({ registerWorker: false });

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
