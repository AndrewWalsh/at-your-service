import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useContext, useEffect } from "react";
import { GeistProvider, Button } from "@geist-ui/core";
import { Ctx } from "./context";
import Drawer from "./Drawer";
export default function App() {
  const [open, setOpen] = useState(false);
  const [storeStruct, setStoreStruct] = useState(null);
  const { store } = useContext(Ctx);
  useEffect(() => {
    store.get().then((store) => {
      setStoreStruct(store);
    });
  }, []);
  if (!storeStruct) {
    return null;
  }
  return _jsxs(GeistProvider, {
    children: [
      _jsx(
        Button,
        Object.assign(
          { style: { margin: "1em" }, onClick: () => setOpen(true) },
          { children: "Open" }
        )
      ),
      _jsx(Drawer, {
        visible: open,
        onClose: () => setOpen(false),
        storeStruct: storeStruct,
      }),
    ],
  });
}
