import { useMemo } from "react";
import { Modal } from "@geist-ui/core";
import { StoreStructure, StoreRoute } from "../types";

type Props = {
  open: boolean;
  storeStruct: StoreStructure;
  onClose: () => void;
};

const slowestRoute = (storeStruct: StoreStructure): StoreRoute => {
  let curMax = -Infinity;
  let slowest: StoreRoute = {
    meta: [],
    pathname: "",
    requestBodySamples: [],
    requestHeadersSamples: [],
    responseBodySamples: [],
    responseHeadersSamples: [],
    queryParameterSamples: [],
  };
  Object.values(storeStruct).forEach((host) => {
    Object.values(host).forEach((pathname) => {
      Object.values(pathname).forEach((method) => {
        Object.values(method).forEach((status) => {
          const mean =
            status.meta.reduce((a, c) => a + c.latencyMs, 0) /
            status.meta.length;
          if (mean > curMax) {
            slowest = status;
            curMax = mean;
          }
        });
      });
    });
  });
  return slowest;
};

export default function Metrics({ open, storeStruct, onClose }: Props) {
  const slowest = useMemo(() => slowestRoute(storeStruct), [storeStruct]);

  // No data to show
  if (slowest.meta.length === 0) {
    return null;
  }

  return (
    <Modal visible={open} onClose={onClose}>
      <Modal.Title>Latency</Modal.Title>
      <Modal.Content>
        <p>
          The slowest route is{" "}
          {`${slowest.pathname} at ${Math.ceil(
            slowest.meta.reduce((a, c) => a + c.latencyMs, 0) /
              slowest.meta.length
          )}ms`}
        </p>
      </Modal.Content>
    </Modal>
  );
}
