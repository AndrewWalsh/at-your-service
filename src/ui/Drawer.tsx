import { useState, useCallback, useEffect } from "react";
import {
  Drawer as GeistDrawer,
  Button,
  Tree,
  useModal,
  Grid,
  Spacer,
} from "@geist-ui/core";
import Menu from "@geist-ui/icons/menu";

import { StoreStructure, StoreRoute } from "../types";
import { storeStructToOpenAPI } from "../lib";
import Metrics from "./Metrics";
import Inspector from "./Inspector";

type Props = {
  visible: boolean;
  onClose: () => void;
  storeStruct: StoreStructure;
};

type StoreStructureDeep =
  | StoreStructure
  | StoreStructure["host"]
  | StoreStructure["host"]["pathname"]
  | StoreStructure["host"]["pathname"]["method"];

// This type guard makes it easy to form a base case for recursion
const isStoreRoute = (
  route: StoreRoute | StoreStructureDeep
): route is StoreRoute => !!route.pathname;

export default function Drawer({ visible, onClose, storeStruct }: Props) {
  const { setVisible, bindings } = useModal(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [content, setContent] = useState<{
    storeRoute: StoreRoute;
    fullPath: string;
  } | null>(null);

  const createTree = useCallback(() => {
    function recurseTree(ssorsr: StoreStructure | StoreRoute, path = "") {
      return Object.entries(ssorsr).map(([key, structOrRoute]) => {
        if (isStoreRoute(structOrRoute)) {
          // TODO: get rid of this 's200' etc business
          const withoutPrefix = key.slice(1);
          const onClick = () => {
            const pathToStoreRoute = path + key;
            setContent({
              storeRoute: structOrRoute,
              fullPath: pathToStoreRoute,
            });
            setVisible(true);
          };
          return (
            <Tree.File
              key={withoutPrefix}
              name={withoutPrefix}
              onClick={onClick}
            />
          );
        }
        return (
          <Tree.Folder key={key} name={key}>
            {recurseTree(structOrRoute, path + key + "/")}
          </Tree.Folder>
        );
      });
    }
    return recurseTree(storeStruct);
  }, [storeStruct]);

  const [treeValue, setTreeValue] = useState(createTree());

  useEffect(() => {
    setTreeValue(createTree());
  }, [visible]);

  return (
    <>
      <GeistDrawer visible={visible} onClose={onClose} placement="left">
        <GeistDrawer.Subtitle>Network Requests</GeistDrawer.Subtitle>
        <GeistDrawer.Content>
          <Grid.Container direction="row" justify="flex-start" gap={1}>
            <Grid>
              {/* <Button
                type="secondary"
                onClick={() => setTreeValue(createTree())}
              >
                Refresh
              </Button> */}
              {/* <Button
                iconRight={<Menu />}
                auto
                scale={0.5}
                onClick={() => setShowMetrics(true)}
              /> */}
            </Grid>
            {/* <Grid>
            <Button
              auto
              type="error"
              onClick={() => {
                
              }}
            >
              Reset
            </Button>
          </Grid> */}
          </Grid.Container>

          <Grid.Container gap={1}>
            <Grid xs>
              <Button
                width="100%"
                type="success"
                onClick={async () => {
                  const res = await storeStructToOpenAPI(storeStruct);
                  navigator.clipboard.writeText(res.getJSON());
                }}
              >
                Copy OpenAPI Spec
              </Button>
            </Grid>
          </Grid.Container>

          <Spacer h={1} />
          <Tree>{treeValue}</Tree>
        </GeistDrawer.Content>

        <Metrics
          open={showMetrics}
          onClose={() => setShowMetrics(false)}
          storeStruct={storeStruct}
        />

        <Inspector bindings={bindings} content={content} />
      </GeistDrawer>
    </>
  );
}
