import { faker } from "@faker-js/faker";

import { Sample } from "../data-types";
import { StoreStructure } from "../types";

const generateFakeSample = (): Sample => new Sample(faker.datatype.json());

type Options = {
  pathname: string;
  method: string;
  reqBodySamples: Array<Sample>;
  reqHeadersSamples: Array<Sample>;
  resBodySamples: Array<Sample>;
  resHeadersSamples: Array<Sample>;
};

const defaults: () => Options = () => ({
  pathname: `/${faker.lorem.word()}`,
  method: faker.internet.httpMethod(),
  reqBodySamples: [generateFakeSample()],
  reqHeadersSamples: [generateFakeSample()],
  resBodySamples: [generateFakeSample()],
  resHeadersSamples: [generateFakeSample()],
});

export const createStoreStructure = (opts = defaults()) => {
  const host = faker.internet.url();
  const status = "s" + faker.internet.httpStatusCode();

  const storeStructure: StoreStructure = {
    [host]: {
      [opts.pathname]: {
        [opts.method]: {
          [status]: {
            reqBodySamples: opts.reqBodySamples,
            reqHeadersSamples: opts.reqHeadersSamples,
            resBodySamples: opts.resBodySamples,
            resHeadersSamples: opts.resHeadersSamples,
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
