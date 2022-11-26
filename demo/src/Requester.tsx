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

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-json";

import { COLOR_SECONDARY } from "./constants";
import initMSW from "./init-msw";

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

function Requester() {
  const worker = useMemo<SetupWorkerApi>(() => setupWorker(), []);
  const [reqEditorVal, setReqEditorVal] = useState('{ "id": 22 }');
  const [resEditorVal, setResEditorVal] = useState(
    JSON.stringify(resEditorDefaultVal, null, 2)
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
    worker.use(
      rest.get(host + pathname, (req, res, ctx) => {
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
    fetch(`${host}${pathname}`);
    toast({
      title: 'API request mocked',
      description: `${method} ${host}${pathname} -> ${status}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const formIsValid = useMemo(() => {
    try {
      const url = new URL(host + pathname);
      if (!isJSON(resEditorVal)) {
        return false;
      }
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        return false;
      }
      if (!isValidHostName(url.host)) {
        return false;
      }
      if (url.pathname !== pathname) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, [resEditorVal, host, pathname]);

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
            <Heading as="h6" size="md" id="dialog2Title">
              Response
            </Heading>
          </Box>
          <AceEditor
            mode="json"
            theme="monokai"
            width="100%"
            height="calc(100% - 32px)"
            name="UNIQUE_ID_OF_DIV_2"
            editorProps={{ $blockScrolling: true }}
            value={resEditorVal}
            onChange={setResEditorVal}
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
            <Box display="flex" flexFlow="row nowrap" alignItems="center" justifyContent="center">
              <Text as="label" htmlFor="id_method" fontWeight="bold" paddingRight="16px" width="100px">
                Method
              </Text>
              <Select
                id="id_method"
                width="auto"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                {/* <option value="PUT">PUT</option> */}
                {/* <option value="POST">POST</option> */}
                {/* <option value="DELETE">DELETE</option> */}
                {/* <option value="PATCH">PATCH</option> */}
              </Select>
            </Box>

            <Box display="flex" flexFlow="row nowrap" alignItems="center" justifyContent="center">
              <Text as="label" htmlFor="id_method" fontWeight="bold" paddingRight="16px" width="100px">
                Host
              </Text>
              <Input
                id="id_host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                size="md"
                width="auto"
              />
            </Box>

            <Box display="flex" flexFlow="row nowrap" alignItems="center" justifyContent="center">
              <Text as="label" htmlFor="id_method" fontWeight="bold" paddingRight="16px" width="100px">
                Pathname
              </Text>
              <Input
                id="id_pathname"
                value={pathname}
                onChange={(e) => setPathname(e.target.value)}
                size="md"
                width="auto"
              />
            </Box>
            
            <Box display="flex" flexFlow="row nowrap" alignItems="center" justifyContent="center">
              <Text as="label" htmlFor="id_method" fontWeight="bold" paddingRight="16px" width="100px">
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
              Requests are visible in the <Code>Network</Code> section of your browser's developer tools
              <br />
              <br />
              Open <Kbd>at-your-service</Kbd> by clicking <Code>Open</Code> in the bottom left corner of the screen
            </Text>
          </Box>
        </Box>
        <Button
          bg={COLOR_SECONDARY}
          colorScheme="blue"
          onClick={onClickMockRequest}
          disabled={!formIsValid}
          type="submit"
        >
          Mock Network Request
        </Button>
      </Box>
    </Box>
  );
}

export default Requester;
