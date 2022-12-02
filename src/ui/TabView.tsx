import { useState, useEffect } from "react";
import { Tabs, Grid, Text } from "@geist-ui/core";

import type { Meta } from "../types";
import type { Sample } from "../data-types";
import TabViewCode from "./TabViewCode";


type Props = {
  samples: Array<Sample>;
  meta: Array<Meta>;
};

export default function TabView({ samples, meta }: Props) {

  if (samples.length === 0 || meta.length === 0) {
    return <p>No results</p>;
  }

  return (
    <Tabs initialValue="1">
      <Tabs.Item label="OpenAPI" value="1">
        <p>
          hi
        </p>
      </Tabs.Item>
      <Tabs.Item label="code" value="2">
        <TabViewCode
          samples={samples}
          meta={meta}
        />
    </Tabs.Item>
  </Tabs>
  );
}
