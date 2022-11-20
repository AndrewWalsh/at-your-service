import { faker } from "@faker-js/faker";

import { Sample } from "../data-types";
import { StoreStructure } from "../types";

const generateFakeSample = (): Sample => new Sample(faker.datatype.json());

type Options = {
  pathname: string;
  method: string;
  reqSamples: Array<Sample>;
  resSamples: Array<Sample>;
};

const defaults: () => Options = () => ({
  pathname: `/${faker.lorem.word()}`,
  method: faker.internet.httpMethod(),
  reqSamples: [generateFakeSample()],
  resSamples: [generateFakeSample()],
});

export const createStoreStructure = (opts = defaults()) => {
  const host = faker.internet.url();
  const status = "s" + faker.internet.httpStatusCode();

  const storeStructure: StoreStructure = {
    [host]: {
      [opts.pathname]: {
        [opts.method]: {
          [status]: {
            reqSamples: opts.reqSamples,
            resSamples: opts.resSamples,
            parameters: {},
            meta: [],
            pathName: opts.pathname,
          },
        },
      },
    },
  };

  return {
    storeStructure,
    host,
    pathname: opts.pathname,
    method: opts.method,
    status,
  };
};
