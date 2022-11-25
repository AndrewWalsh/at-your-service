import { useState, useEffect, MouseEvent } from "react";
import { Box, Select, Input, Button, Heading } from "@chakra-ui/react";
import { setupWorker, rest, SetupWorkerApi } from "msw";

import { startAtYourService } from "at-your-service";
// import { startAtYourService } from "../../src";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";

import { COLOR_SECONDARY } from "./constants";

const LOCALHOST_API = "http://localhost:8080";
const SW_PATH = `${import.meta.env.BASE_URL}mockServiceWorker.js`;

const initialiseWorker = async () => {
  // const worker = setupWorker(
  //   rest.get("http://localhost:8080/hello", (req, res, ctx) => {
  //     return res(
  //       ctx.delay(1500),
  //       ctx.status(202, "Mocked status"),
  //       ctx.json({
  //         message: "Mocked response JSON body",
  //       })
  //     );
  //   })
  // );
  const worker = setupWorker();
  // const worker = setupWorker(
  //   rest.get("https://example.com/api", (req, res, ctx) => {
  //     return res(ctx.delay(50), ctx.status(200, "OK"), ctx.json({}));
  //   })
  // );

  await window.navigator.serviceWorker.register(SW_PATH);

  worker.start({
    findWorker(scriptUrl) {
      return scriptUrl.includes("mockServiceWorker.js");
    },
    quiet: true,
  });

  if (window.navigator) {
    window.navigator.serviceWorker.ready.then(() => {
      startAtYourService({ registerWorker: false });
    });
  }
  return worker;
};

type Opts = {
  host: string;
  pathname: string;
  method: string;
  status: number;
  body: any;
};
const getWorkerMockingReq = (o: Opts) => {
  const worker = setupWorker(
    rest.get(o.host + o.pathname, (req, res, ctx) => {
      return res(ctx.delay(50), ctx.status(o.status, "OK"), ctx.json(o.body));
    }),
    rest.get("https://example.com/api", (req, res, ctx) => {
      return res(ctx.delay(50), ctx.status(o.status, "OK"), ctx.json(o.body));
    }),

  );

  worker.start({
    findWorker(scriptUrl) {
      return scriptUrl.includes("mockServiceWorker.js");
    },
    quiet: true,
  });

  return worker;
};

function Requester() {
  const [worker, setWorker] = useState<SetupWorkerApi | null>(null);
  const [reqEditorVal, setReqEditorVal] = useState("");
  const [resEditorVal, setResEditorVal] = useState("");
  const [host, setHost] = useState("https://example.com");
  const [pathname, setPathname] = useState("/api");
  const [method, setMethod] = useState("GET");
  const [status, setStatus] = useState("200");

  // Start the worker with a dummy handler
  useEffect(() => {
    if (!worker) {
      initialiseWorker().then((worker) => {
        setWorker(worker);
      });
    }
    return () => {
      worker?.stop();
      setWorker(null);
    };
  }, []);

  const onClickMockRequest = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!worker) {
      return;
    }
    // worker.resetHandlers();
    worker.use(
      rest.get(host + pathname, (req, res, ctx) => {
        return res(
          ctx.delay(50),
          ctx.status(Number(status), "OK"),
          ctx.json({})
        );
      }),
      rest.get("https://example.com/api", (req, res, ctx) => {
        return res(ctx.delay(50), ctx.status(200, "OK"), ctx.json({}));
      })
    );
    // const newWorker = getWorkerMockingReq({
    //   host,
    //   pathname,
    //   method,
    //   status: Number(status),
    //   body: JSON.parse(resEditorVal),
    // });
    fetch(`${host}${pathname}`);
  };
  return (
    <Box
      borderRadius="1px"
      display="flex"
      flexFlow="column nowrap"
      boxSizing="border-box"
    >
      <Box display="flex" flexFlow="row wrap" flex="1" height="100%" gap={6}>
        <Box
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
        </Box>
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

      <Box display="flex" flexFlow="column nowrap">
        <Box
          minHeight="64px"
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexFlow="row wrap"
          gap={2}
          margin="8px 0"
        >
          <Select
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
            value={host}
            onChange={(e) => setHost(e.target.value)}
            size="md"
            width="auto"
          />

          <Input
            value={pathname}
            onChange={(e) => setPathname(e.target.value)}
            size="md"
            width="auto"
          />

          <Select
            width="auto"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="200">200</option>
            <option value="400">400</option>
          </Select>
        </Box>
        <Button
          bg={COLOR_SECONDARY}
          colorScheme="blue"
          onClick={onClickMockRequest}
        >
          Mock Network Request
        </Button>
      </Box>
    </Box>
  );
}

export default Requester;
