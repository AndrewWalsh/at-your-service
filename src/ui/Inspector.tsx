import { Modal, Tabs } from "@geist-ui/core";

import TabViewOpenAPI from "./TabViewOpenAPI";
import { StoreRoute, Meta } from "../types";
import TabViewCode from "./TabViewCode";
import { ModalHooksBindings } from "@geist-ui/core/esm/use-modal";

const meanLatency = (meta: Array<Meta>) => {
  return Math.round(
    meta.reduce((acc, { latencyMs }) => latencyMs + acc, 0) / meta.length
  );
};

type Props = {
  bindings: ModalHooksBindings;
  content: {
    storeRoute: StoreRoute;
    fullPath: string;
  } | null;
};

export default function Inspector({ bindings, content }: Props) {
  if (!content) {
    return null;
  }
  return (
    <Modal {...bindings} width="80vw" height="80vh">
      {content && (
        <>
          <Modal.Title>{`~${meanLatency(
            content.storeRoute.meta
          )}ms`}</Modal.Title>
          <Modal.Content style={{ overflow: "scroll" }}>
            <Tabs initialValue="1">
              <Tabs.Item label="Open API" value="1">
                <TabViewOpenAPI
                  storeRoute={content.storeRoute}
                  fullPath={content.fullPath}
                />
              </Tabs.Item>
              <Tabs.Item label="request" value="2">
                <TabViewCode
                  samples={content.storeRoute.requestBodySamples}
                  meta={content.storeRoute.meta}
                />
              </Tabs.Item>
              <Tabs.Item label="response" value="3">
                <TabViewCode
                  samples={content.storeRoute.responseBodySamples}
                  meta={content.storeRoute.meta}
                />
              </Tabs.Item>
            </Tabs>
          </Modal.Content>
        </>
      )}
    </Modal>
  );
}
