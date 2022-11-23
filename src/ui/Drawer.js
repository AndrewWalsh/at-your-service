var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
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
import { storeStructToOpenAPI } from "../lib";
import TabView from "./TabView";
const meanLatency = (meta) => {
  return Math.round(
    meta.reduce((acc, { latencyMs }) => latencyMs + acc, 0) / meta.length
  );
};
// This type guard makes it easy to form a base case for recursion
const isStoreRoute = (route) => !!route.pathName;
export default function Drawer({ visible, onClose, storeStruct }) {
  const { setVisible, bindings } = useModal();
  const [content, setContent] = useState(null);
  const createTree = useCallback(() => {
    function recurseTree(ssorsr) {
      return Object.entries(ssorsr).map(([key, structOrRoute]) => {
        if (isStoreRoute(structOrRoute)) {
          // TODO: get rid of this 's200' etc business
          const withoutPrefix = key.slice(1);
          const onClick = () => {
            setContent({ storeRoute: structOrRoute });
            setVisible(true);
          };
          return _jsx(
            Tree.File,
            { name: withoutPrefix, onClick: onClick },
            withoutPrefix
          );
        }
        return _jsx(
          Tree.Folder,
          Object.assign(
            { name: key },
            { children: recurseTree(structOrRoute) }
          ),
          key
        );
      });
    }
    return recurseTree(storeStruct);
  }, [storeStruct]);
  const [treeValue, setTreeValue] = useState(createTree());
  useEffect(() => {
    setTreeValue(createTree());
  }, [visible]);
  return _jsxs(
    GeistDrawer,
    Object.assign(
      { visible: visible, onClose: onClose, placement: "left" },
      {
        children: [
          _jsx(GeistDrawer.Title, { children: "at-your-service" }),
          _jsx(GeistDrawer.Subtitle, { children: "recorded API calls" }),
          _jsxs(GeistDrawer.Content, {
            children: [
              _jsxs(
                Grid.Container,
                Object.assign(
                  { direction: "row", justify: "space-around", gap: 1 },
                  {
                    children: [
                      _jsx(Grid, {
                        children: _jsx(
                          Button,
                          Object.assign(
                            {
                              auto: true,
                              type: "secondary",
                              onClick: () => setTreeValue(createTree()),
                            },
                            { children: "Refresh" }
                          )
                        ),
                      }),
                      _jsx(Grid, {
                        children: _jsx(
                          Button,
                          Object.assign(
                            {
                              auto: true,
                              type: "success",
                              onClick: () =>
                                __awaiter(this, void 0, void 0, function* () {
                                  const res = yield storeStructToOpenAPI(
                                    storeStruct
                                  );
                                  navigator.clipboard.writeText(res.getJSON());
                                }),
                            },
                            { children: "Copy OAI 3.1" }
                          )
                        ),
                      }),
                    ],
                  }
                )
              ),
              _jsx(Spacer, { h: 1 }),
              _jsx(Tree, { children: treeValue }),
            ],
          }),
          _jsx(
            Modal,
            Object.assign(
              {},
              bindings,
              { width: "50vw" },
              {
                children:
                  content &&
                  _jsxs(_Fragment, {
                    children: [
                      _jsx(Modal.Title, {
                        children: `~${meanLatency(content.storeRoute.meta)}ms`,
                      }),
                      _jsx(Modal.Content, {
                        children: _jsxs(
                          Tabs,
                          Object.assign(
                            { initialValue: "2" },
                            {
                              children: [
                                _jsx(
                                  Tabs.Item,
                                  Object.assign(
                                    { label: "request", value: "1" },
                                    {
                                      children: _jsx(TabView, {
                                        samples: content.storeRoute.reqSamples,
                                        meta: content.storeRoute.meta,
                                      }),
                                    }
                                  )
                                ),
                                _jsx(
                                  Tabs.Item,
                                  Object.assign(
                                    { label: "response", value: "2" },
                                    {
                                      children: _jsx(TabView, {
                                        samples: content.storeRoute.resSamples,
                                        meta: content.storeRoute.meta,
                                      }),
                                    }
                                  )
                                ),
                              ],
                            }
                          )
                        ),
                      }),
                    ],
                  }),
              }
            )
          ),
        ],
      }
    )
  );
}
