import { useState, useEffect } from "react";
import { Grid } from "@geist-ui/core";

import { storeStructToOpenAPI, getPathToStoreRoute } from "../lib";
import type { StoreStructure, StoreRoute } from "../types";
import Code from "./Code";
import NoData from "./NoData";

type Props = {
  storeRoute: StoreRoute;
  fullPath: string;
};

const storeRouteToStoreStruct = (
  storeRoute: StoreRoute,
  fullPath: string
): StoreStructure => {
  const [host, path, method, status] = getPathToStoreRoute(fullPath);
  const storeStructure: StoreStructure = {
    [host]: {
      [path]: {
        [method]: {
          [status]: storeRoute,
        },
      },
    },
  };
  return storeStructure;
};

export default function TabViewCode({ storeRoute, fullPath }: Props) {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    storeStructToOpenAPI(storeRouteToStoreStruct(storeRoute, fullPath)).then(
      (s) => setCode(s.getJSON())
    );
  }, [storeRoute]);

  if (!code) {
    return <NoData />;
  }

  return (
    <Grid.Container>
      <Grid style={{ overflowX: "scroll", width: "100%" }}>
        <Code language="JSON" code={code} />
      </Grid>
    </Grid.Container>
  );
}
