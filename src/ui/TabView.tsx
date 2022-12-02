import type { Meta } from "../types";
import type { Sample } from "../data-types";
import TabViewCode from "./TabViewCode";

type Props = {
  bodySamples: Array<Sample>;
  headersSamples: Array<Sample>;
  meta: Array<Meta>;
};

export default function TabView({ bodySamples, headersSamples, meta }: Props) {
  if (bodySamples.length === 0 || meta.length === 0) {
    return <p>No results</p>;
  }

  return <TabViewCode samples={bodySamples} meta={meta} />;
}
