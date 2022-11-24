import { useState, useEffect } from "react";
import { setupWorker, rest } from "msw";
import { Box } from "@chakra-ui/react";

import Requester from "./Requester";

// import { startAtYourService } from "at-your-service";
import { startAtYourService } from "../../src";

import logo from "./assets/logo.png";

const LOCALHOST_API = "http://localhost:8080";
const SW_PATH = `${import.meta.env.BASE_URL}mockServiceWorker.js`;

const run = async () => {
  const worker = setupWorker(
    rest.get("http://localhost:8080/hello", (req, res, ctx) => {
      return res(
        ctx.delay(1500),
        ctx.status(202, "Mocked status"),
        ctx.json({
          message: "Mocked response JSON body",
        })
      );
    })
  );

  await window.navigator.serviceWorker.register(SW_PATH);

  worker.start({
    findWorker(scriptUrl) {
      return scriptUrl.includes("mockServiceWorker.js");
    },
  });

  if (window.navigator) {
    window.navigator.serviceWorker.ready.then(() => {
      startAtYourService({ registerWorker: false });
    });
  }
};

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    run();
  }, []);

  const click = () => {
    fetch(`${LOCALHOST_API}/hello`);
    // fetch(
    //   `${LOCALHOST_API}/requires/996a27ec-cdfb-4ca6-a458-e6f7a4870325/info?hi=aa`
    // );
    // fetch(
    //   `${LOCALHOST_API}/requires/996a27ec-cdfb-4ca6-a458-e6f7a4870325/info?hi=1`
    // );
    setCount(count + 1);
  };

  return (
    <Box
      bg="tomato"
      p={0}
      width="100%"
      height="100vh"
      display="flex"
      flexFlow="column nowrap"
    >
      <Box
        border="1px solid #001758"
        bg="#283F80"
        width="100%"
        maxHeight="64px"
        flex="1"
      ></Box>

      <Box
        width="100%"
        maxHeight="calc(100vh - 64px)"
        flex="1"
        alignItems="center"
        justifyContent="center"
        display="flex"
      >
        <Box maxHeight="80%" width="80%" marginBottom="64px">
          <Requester />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
