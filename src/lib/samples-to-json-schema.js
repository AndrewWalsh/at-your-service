import { createCompoundSchema } from "genson-js";
export default function (samples) {
  const mappedSamples = samples.map((s) => s.toJSON());
  const converted = createCompoundSchema(mappedSamples);
  return converted;
}
