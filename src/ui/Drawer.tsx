import { useState, useCallback, useEffect } from "react";
import {
  Drawer as GeistDrawer,
  Button,
  Tree,
  useModal,
  Modal,
  Grid,
  Spacer,
  Tabs,
} from "@geist-ui/core";

import { StoreStructure, StoreRoute, Meta } from "../types";
import { storeStructToOpenAPI } from "../lib";
import TabView from "./TabView";

const meanLatency = (meta: Array<Meta>) => {
  return Math.round(
    meta.reduce((acc, { latencyMs }) => latencyMs + acc, 0) / meta.length
  );
};

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
): route is StoreRoute => !!route.pathName;

export default function Drawer({ visible, onClose, storeStruct }: Props) {
  const { setVisible, bindings } = useModal();
  const [content, setContent] = useState<{ storeRoute: StoreRoute } | null>(
    null
  );

  const createTree = useCallback(() => {
    function recurseTree(ssorsr: StoreStructure | StoreRoute) {
      return Object.entries(ssorsr).map(([key, structOrRoute]) => {
        if (isStoreRoute(structOrRoute)) {
          // TODO: get rid of this 's200' etc business
          const withoutPrefix = key.slice(1);
          const onClick = () => {
            setContent({ storeRoute: structOrRoute });
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
            {recurseTree(structOrRoute)}
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
    <GeistDrawer visible={visible} onClose={onClose} placement="left">
      {/* <GeistDrawer.Title>at-your-service</GeistDrawer.Title> */}
      <GeistDrawer.Subtitle>Network requests</GeistDrawer.Subtitle>
      <GeistDrawer.Content>
        <Grid.Container direction="row" justify="space-around" gap={1}>
          <Grid>
            {/* <Button
              width="100%"
              type="secondary"
              onClick={() => setTreeValue(createTree())}
            >
              Refresh
            </Button> */}
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

      <Modal {...bindings} width="500px" height="500px">
        {content && (
          <>
            <Modal.Title>{`~${meanLatency(
              content.storeRoute.meta
            )}ms`}</Modal.Title>
            <Modal.Content style={{ overflow: "scroll" }}>
              <Tabs initialValue="2">
                <Tabs.Item label="request" value="1">
                  <TabView
                    samples={content.storeRoute.reqSamples}
                    meta={content.storeRoute.meta}
                  />
                </Tabs.Item>
                <Tabs.Item label="response" value="2">
                  <TabView
                    samples={content.storeRoute.resSamples}
                    meta={content.storeRoute.meta}
                  />
                </Tabs.Item>
              </Tabs>
            </Modal.Content>
          </>
        )}
      </Modal>
    </GeistDrawer>
  );
}
