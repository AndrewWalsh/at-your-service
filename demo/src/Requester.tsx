import { useState, useEffect, MouseEvent, useMemo } from "react";
import {
  Box,
  Select,
  Input,
  Button,
  Heading,
  Text,
  Code,
  Kbd,
  useToast,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { setupWorker, rest, SetupWorkerApi } from "msw";
import isJSON from "validator/es/lib/isJSON";
import isValidHostName from "is-valid-hostname";

import ace from "ace-builds/src-noconflict/ace";
ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/"
);
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-json";

import { COLOR_SECONDARY } from "./constants";
import initMSW from "./init-msw";
import useSWIsReady from "./useSWIsReady";
import KeyValue, { KV } from "./KeyValue";

const reqEditorDefaultVal = {
  id: 42,
};

const resEditorDefaultVal = {
  text: "simulate some requests and check out the tool",
  number: 1,
  null: null,
  array: [1, 2, 3],
  object: {
    nested: {
      hello: "world",
    },
  },
};

const prettyPrintJSON = (json: {}) => JSON.stringify(json, null, 2);

function Requester() {
  const swIsRead = useSWIsReady();
  const worker = useMemo<SetupWorkerApi>(() => setupWorker(), []);
  const [reqEditorVal, setReqEditorVal] = useState(
    prettyPrintJSON(reqEditorDefaultVal)
  );
  const [resEditorVal, setResEditorVal] = useState(
    prettyPrintJSON(resEditorDefaultVal)
  );
  const [host, setHost] = useState("https://example.com");
  const [pathname, setPathname] = useState("/api");
  const [method, setMethod] = useState("POST");
  const [status, setStatus] = useState("200");
  const toast = useToast({ position: "top" });

  const [requestHeaders, setRequestHeaders] = useState<KV>([]);
  const [responseHeaders, setResponseHeaders] = useState<KV>([]);

  // Start the worker with a dummy handler
  useEffect(() => {
    initMSW(worker);
  }, []);

  const onClickMockRequest = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!worker) {
      return;
    }
    worker.resetHandlers();
    const handler = rest[method.toLowerCase()] as typeof rest.get;
    worker.use(
      handler(host + pathname, (req, res, ctx) => {
        return res(
          ctx.delay(50),
          ctx.status(Number(status), "OK"),
          ctx.json(JSON.parse(resEditorVal)),
          ctx.set(Object.fromEntries(responseHeaders))
        );
      }),
      rest.get("https://example.com/api", (req, res, ctx) => {
        return res(ctx.delay(50), ctx.status(200, "OK"), ctx.json({}));
      })
    );
    const params = showReqEditor
      ? { method, headers: requestHeaders, body: reqEditorVal }
      : { method, headers: requestHeaders };
    fetch(`${host}${pathname}`, params);
    toast({
      title: "API request mocked",
      description: `${method} ${host}${pathname} -> ${status}`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const showReqEditor = method !== "GET" && method !== "DELETE";

  const reqEditorIsValid = useMemo(() => {
    if (!showReqEditor) {
      return true;
    }
    try {
      if (!isJSON(reqEditorVal)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, [reqEditorVal]);

  const resEditorIsValid = useMemo(() => {
    try {
      if (!isJSON(resEditorVal)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, [resEditorVal]);

  const hostIsValid = useMemo(() => {
    try {
      const url = new URL(host + pathname);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        return false;
      }
      const valid = isValidHostName(url.host);
      return valid;
    } catch {
      return false;
    }
  }, [host, pathname]);

  const pathnameIsValid = useMemo(() => {
    try {
      const url = new URL(host + pathname);
      return url.pathname === pathname;
    } catch {
      return false;
    }
  }, [pathname]);

  return (
    <Box
      borderRadius="1px"
      display="flex"
      flexFlow="column nowrap"
      boxSizing="border-box"
      gap={2}
    >
      <Box display="flex" flexFlow="row wrap" flex="1" height="100%" gap={4}>
        {showReqEditor && (
          <Box
            flex="1"
            minWidth="300px"
            boxSizing="border-box"
            role="dialog"
            aria-labelledby="dialog1Title"
            minHeight="384px"
          >
            <Box height="32px" display="flex" alignItems="center">
              <Heading
                as="label"
                size="md"
                id="dialog1Title"
                htmlFor="ace-editor-req-bdy"
              >
                Request Body
              </Heading>
            </Box>
            <AceEditor
              mode="json"
              theme="monokai"
              width="100%"
              height="calc(100% - 32px)"
              name="ace-editor-req-bdy"
              style={
                reqEditorIsValid
                  ? undefined
                  : {
                      outline: "2px solid #e53e3e",
                      boxShadow: "0 0 0 1px #e53e3e",
                      borderRadius: "0.375rem",
                    }
              }
              editorProps={{ $blockScrolling: true }}
              value={reqEditorVal}
              onChange={setReqEditorVal}
              aria-invalid={!reqEditorIsValid}
              onBlur={() => {
                try {
                  const val = prettyPrintJSON(JSON.parse(reqEditorVal));
                  setReqEditorVal(val);
                } catch {}
              }}
            />
          </Box>
        )}
        <Box
          flex="1"
          minWidth="300px"
          boxSizing="border-box"
          role="dialog"
          aria-labelledby="dialog2Title"
          minHeight="384px"
        >
          <Box height="32px" display="flex" alignItems="center">
            <Heading
              as="label"
              size="md"
              id="dialog2Title"
              htmlFor="ace-editor-res-bdy"
            >
              Response Body
            </Heading>
          </Box>
          <AceEditor
            mode="json"
            theme="monokai"
            width="100%"
            height="calc(100% - 32px)"
            name="ace-editor-res-bdy"
            style={
              resEditorIsValid
                ? undefined
                : {
                    outline: "2px solid #e53e3e",
                    boxShadow: "0 0 0 1px #e53e3e",
                    borderRadius: "0.375rem",
                  }
            }
            editorProps={{ $blockScrolling: true }}
            value={resEditorVal}
            onChange={setResEditorVal}
            aria-invalid={!resEditorIsValid}
            onBlur={() => {
              try {
                const val = prettyPrintJSON(JSON.parse(resEditorVal));
                setResEditorVal(val);
              } catch {}
            }}
          />
        </Box>
      </Box>

      <Box display="flex" flexFlow="column" as="form" gap={4} marginTop="8px">
        <Button
          bg={COLOR_SECONDARY}
          colorScheme="blue"
          onClick={onClickMockRequest}
          disabled={
            !reqEditorIsValid || !resEditorIsValid || !hostIsValid || !pathnameIsValid || !swIsRead
          }
          type="submit"
        >
          Mock Network Request
        </Button>

        <Box display="flex" flexFlow="row wrap" justifyContent="space-around">
          <Box
            paddingTop="32px"
            display="flex"
            alignItems="flex-start"
            flexFlow="column nowrap"
            gap={4}
            maxHeight="250px"
          >
            <InputGroup>
              <InputLeftAddon children="Method" width="100px" />
              <Select
                width="auto"
                value={method}
                minWidth="211px"
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="POST">POST</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <InputLeftAddon children="Host" width="100px" />
              <Input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                width="auto"
                isInvalid={!hostIsValid}
                placeholder="E.g. http://example.com"
              />
            </InputGroup>

            <InputGroup>
              <InputLeftAddon children="Pathname" width="100px" />
              <Input
                value={pathname}
                onChange={(e) => setPathname(e.target.value)}
                width="auto"
                isInvalid={!pathnameIsValid}
                isDisabled={!hostIsValid}
                placeholder="E.g. /api/v1/users"
              />
            </InputGroup>

            <InputGroup>
              <InputLeftAddon children="Status" width="100px" />
              <Select
                width="auto"
                minWidth="211px"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="200">200</option>
                <option value="400">400</option>
              </Select>
            </InputGroup>
          </Box>

          <Box
            maxHeight="250px"
            overflow="scroll"
            width="300px"
            paddingTop="32px"
          >
            <KeyValue title="Request header" onChange={setRequestHeaders} />
          </Box>

          <Box
            maxHeight="250px"
            overflow="scroll"
            width="300px"
            paddingTop="32px"
          >
            <KeyValue title="Response header" onChange={setResponseHeaders} />
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex="1"
          marginTop="5vh"
        >
          <Text padding="1em" textAlign="center">
            Simulate an API request on the browser
            <br />
            <br />
            Requests are visible in the <Code>Network</Code> section of your
            browser's developer tools
            <br />
            <br />
            Open <Kbd>at-your-service</Kbd> by clicking <Code>Open</Code> in the
            bottom left corner of the screen
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default Requester;
