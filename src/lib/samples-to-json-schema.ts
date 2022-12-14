import { createCompoundSchema, Schema } from "genson-js";

import type { Sample } from "../data-types";

export default function (samples: Array<Sample>): Schema {
  const mappedSamples = samples.map((s) => s.getSample());
  const converted = createCompoundSchema(mappedSamples);
  return converted;
}
