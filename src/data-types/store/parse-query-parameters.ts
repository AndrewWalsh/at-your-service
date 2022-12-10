import Sample from "../sample";

export default function parseQueryParameters(
  queryParams: URLSearchParams
): Sample {
  const qpStore: { [k: string]: string } = {};
  for (const [qpName, qpValue] of queryParams) {
    qpStore[qpName] = qpValue;
  }
  const sample = new Sample(JSON.stringify(qpStore));
  return sample;
}
