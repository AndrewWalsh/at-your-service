import { faker } from "@faker-js/faker";

import { Sample } from "../data-types";
import { StoreStructure } from "../types";

const generateFakeSample = (): Sample => new Sample(faker.datatype.json());

type Options = {
  pathname: string;
  method: string;
  status: string;
  requestBodySamples: Array<Sample>;
  requestHeadersSamples: Array<Sample>;
  responseBodySamples: Array<Sample>;
  responseHeadersSamples: Array<Sample>;
};

const defaults: () => Options = () => ({
  pathname: `/${faker.lorem.word()}`,
  method: faker.internet.httpMethod(),
  status: "s" + faker.internet.httpStatusCode(),
  requestBodySamples: [generateFakeSample()],
  requestHeadersSamples: [generateFakeSample()],
  responseBodySamples: [generateFakeSample()],
  responseHeadersSamples: [generateFakeSample()],
});

export const createStoreStructure = (opts = defaults()) => {
  const host = faker.internet.url();

  const storeStructure: StoreStructure = {
    [host]: {
      [opts.pathname]: {
        [opts.method]: {
          [opts.status]: {
            requestBodySamples: opts.requestBodySamples,
            requestHeadersSamples: opts.requestHeadersSamples,
            responseBodySamples: opts.responseBodySamples,
            responseHeadersSamples: opts.responseHeadersSamples,
            queryParameterSamples: {},
            meta: [],
            pathname: opts.pathname,
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
    status: opts.status,
  };
};
