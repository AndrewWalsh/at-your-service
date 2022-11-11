import { faker } from "@faker-js/faker";

import { Sample } from '../data-types'
import { StoreStructure } from "../types";

const generateFakeSample = (): Sample => new Sample(faker.datatype.json())

type Options = {
  reqSamples: Array<Sample>;
  resSamples: Array<Sample>;
};

const defaults: () => Options = () => ({
  reqSamples: [generateFakeSample()],
  resSamples: [generateFakeSample()],
})

export const createStoreStructure = (opts = defaults()) => {
  const host = faker.internet.url()
  const pathname = `/${faker.lorem.word()}`
  const method = faker.internet.httpMethod()
  const status = faker.internet.httpMethod()

  const storeStructure: StoreStructure = {
    [host]: {
      [pathname]: {
        [method]: {
          [status]: {
            reqSamples: opts.reqSamples,
            resSamples: opts.resSamples,
            parameters: {},
            meta: [],
            pathName: pathname,
          }
        }
      }
    }
  }

  return {
    storeStructure,
    host,
    pathname,
    method,
    status,
  }
}
