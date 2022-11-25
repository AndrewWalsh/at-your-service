import { useState, useEffect, MouseEvent, useMemo } from "react";
import { Box, Select, Input, Button, Heading, Text, Code, Kbd } from "@chakra-ui/react";
import { setupWorker, rest, SetupWorkerApi } from "msw";
import isJSON from "validator/es/lib/isJSON";
import isValidHostName from "is-valid-hostname";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-json";

import { COLOR_SECONDARY } from "./constants";
import initMSW from "./init-msw";

function Requester() {
  const worker = useMemo<SetupWorkerApi>(() => setupWorker(), []);
  const [reqEditorVal, setReqEditorVal] = useState('{ "id": 22 }');
  const [resEditorVal, setResEditorVal] = useState(
    '{ "message": "mock me then open the tool" }'
  );
  const [host, setHost] = useState("https://example.com");
  const [pathname, setPathname] = useState("/api");
  const [method, setMethod] = useState("GET");
  const [status, setStatus] = useState("200");

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

      <Box display="flex" flexFlow="column" as="form" gap={2}>
        <Box display="flex" flexFlow="row wrap" gap={4}>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            flexFlow="column nowrap"
            gap={4}
            margin="8px 0"
          >
            <Text as="label" htmlFor="id_method">
              Method
            </Text>
            <Text as="label" htmlFor="id_host">
              Host
            </Text>
            <Text as="label" htmlFor="id_pathname">
              Pathname
            </Text>
            <Text as="label" htmlFor="id_status">
              Status
            </Text>
          </Box>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            flexFlow="column nowrap"
            gap={4}
            margin="8px 0"
          >
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

            <Input
              id="id_host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              size="md"
              width="auto"
            />

            <Input
              id="id_pathname"
              value={pathname}
              onChange={(e) => setPathname(e.target.value)}
              size="md"
              width="auto"
            />

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

          <Box display="flex" alignItems="center" justifyContent="center" flex="1">
            <Text padding="1em">
              Requests are real, see the <Code>Network</Code> tab in <Code>dev tools</Code> (<Kbd>CMD</Kbd> + <Kbd>i</Kbd>)
              <br />
              <br />
              Open the <Kbd>at-your-service</Kbd> tool by clicking the button in the bottom left
              <br />
              <br />
              View schema and code samples from your mocked network request
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
