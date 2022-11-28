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
} from "@chakra-ui/react";
import { setupWorker, rest, SetupWorkerApi } from "msw";
import isJSON from "validator/es/lib/isJSON";
import isValidHostName from "is-valid-hostname";

import ace from 'ace-builds/src-noconflict/ace';
ace.config.set(
  "basePath", 
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/"
)
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-json";

import { COLOR_SECONDARY } from "./constants";
import initMSW from "./init-msw";
import useSWIsReady from "./useSWIsReady";

const resEditorDefaultVal = {
  text: "at-your-service stores requests and responses as samples",
  textTwo: "when these differ, this is accounted",
  textThree:
    "submit this request, edit this response, and see the difference yourself",
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
  const [reqEditorVal, setReqEditorVal] = useState('{ "id": 22 }');
  const [resEditorVal, setResEditorVal] = useState(
    prettyPrintJSON(resEditorDefaultVal)
  );
  const [host, setHost] = useState("https://example.com");
  const [pathname, setPathname] = useState("/api");
  const [method, setMethod] = useState("GET");
  const [status, setStatus] = useState("200");
  const toast = useToast({ position: "top" });

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
    const handler = rest[method.toLowerCase()] as typeof rest.get
    worker.use(
      handler(host + pathname, (req, res, ctx) => {
        return res(
          ctx.delay(50),
          ctx.status(Number(status), "OK"),
          ctx.json(JSON.parse(resEditorVal))
        );
      }),
      rest.get("https://example.com/api", (req, res, ctx) => {
        return res(ctx.delay(50), ctx.status(200, "OK"), ctx.json({}));
      })
    );
    fetch(`${host}${pathname}`, { method });
    toast({
      title: "API request mocked",
      description: `${method} ${host}${pathname} -> ${status}`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

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
      <Box display="flex" flexFlow="row wrap" flex="1" height="100%" gap={6}>
        {/* <Box
          flex="1"
          minWidth="300px"
          boxSizing="border-box"
          role="dialog"
          aria-labelledby="dialog1Title"
          minHeight="384px"
        >
          <Box height="32px" display="flex" alignItems="center">
            <Heading as="h6" size="md" id="dialog1Title">
              Request
            </Heading>
          </Box>
          <AceEditor
            mode="json"
            theme="monokai"
            width="100%"
            height="calc(100% - 32px)"
            name="UNIQUE_ID_OF_DIV_1"
            editorProps={{ $blockScrolling: true }}
            value={reqEditorVal}
            onChange={setReqEditorVal}
          />
        </Box> */}
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
        <Box display="flex" flexFlow="row wrap">
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            flexFlow="column nowrap"
            gap={6}
          >
            <Box
              display="flex"
              flexFlow="row nowrap"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                as="label"
                htmlFor="id_method"
                fontWeight="bold"
                paddingRight="16px"
                width="100px"
              >
                Method
              </Text>
              <Select
                id="id_method"
                width="auto"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="POST">POST</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </Select>
            </Box>

            <Box
              display="flex"
              flexFlow="row nowrap"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                as="label"
                htmlFor="id_method"
                fontWeight="bold"
                paddingRight="16px"
                width="100px"
              >
                Host
              </Text>
              <Input
                id="id_host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                size="md"
                width="auto"
                isInvalid={!hostIsValid}
                placeholder="E.g. http://example.com"
              />
            </Box>

            <Box
              display="flex"
              flexFlow="row nowrap"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                as="label"
                htmlFor="id_method"
                fontWeight="bold"
                paddingRight="16px"
                width="100px"
              >
                Pathname
              </Text>
              <Input
                id="id_pathname"
                value={pathname}
                onChange={(e) => setPathname(e.target.value)}
                size="md"
                width="auto"
                isInvalid={!pathnameIsValid}
                isDisabled={!hostIsValid}
                placeholder="E.g. /api/v1/users"
              />
            </Box>

            <Box
              display="flex"
              flexFlow="row nowrap"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                as="label"
                htmlFor="id_method"
                fontWeight="bold"
                paddingRight="16px"
                width="100px"
              >
                Status
              </Text>
              <Select
                id="id_status"
                width="auto"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="200">200</option>
                <option value="400">400</option>
              </Select>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex="1"
          >
            <Text padding="1em" textAlign="center">
              Simulate an API request on the browser
              <br />
              <br />
              Requests are visible in the <Code>Network</Code> section of your
              browser's developer tools
              <br />
              <br />
              Open <Kbd>at-your-service</Kbd> by clicking <Code>Open</Code> in
              the bottom left corner of the screen
            </Text>
          </Box>
        </Box>
        <Button
          bg={COLOR_SECONDARY}
          colorScheme="blue"
          onClick={onClickMockRequest}
          disabled={!resEditorIsValid || !hostIsValid || !pathnameIsValid || !swIsRead}
          type="submit"
        >
          Mock Network Request
        </Button>
      </Box>
    </Box>
  );
}

export default Requester;
