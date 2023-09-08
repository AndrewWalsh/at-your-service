import { SetupWorker } from "msw";

import { startAtYourService } from "at-your-service";
// import { startAtYourService } from "../../src";

const initialiseWorker = async (worker: SetupWorker) => {
  worker.start({
    quiet: true,
    onUnhandledRequest: "bypass",
  });

  startAtYourService({ registerWorker: false });

  return worker;
};

let worker: SetupWorker;
let didCall = false;
export default async (setupWorker: SetupWorker) => {
  if (didCall) {
    return worker;
  }
  didCall = true;
  worker = await initialiseWorker(setupWorker);
  return worker;
};
