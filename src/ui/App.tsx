import { useState, useContext, useEffect } from "react";
import { GeistProvider, Button } from "@geist-ui/core";

import { Ctx } from "./context";
import { StoreStructure } from "../types";
import Drawer from "./Drawer";

export default function App() {
  const [open, setOpen] = useState(false);
  const [storeStruct, setStoreStruct] = useState<StoreStructure | null>(null);
  const { store, options } = useContext(Ctx);

  useEffect(() => {
    store.get().then((store) => {
      setStoreStruct(store);
    });
  }, []);

  if (!storeStruct) {
    return null;
  }

  return (
    <GeistProvider>
      <Button style={{ margin: "1em" }} onClick={() => setOpen(true)}>
        Open at-your-service
      </Button>

      <Drawer
        visible={open}
        onClose={() => setOpen(false)}
        storeStruct={storeStruct}
      />
    </GeistProvider>
  );
}
