import { useState } from "react";
import { setupWorker, rest } from "msw";

import { startAtYourService } from "at-your-service";
// import { startAtYourService } from "../../src";

// @ts-expect-error
import logo from "./assets/logo.png";
import "./App.css";

const LOCALHOST_API = "http://localhost:8080";

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

worker.start({ findWorker(scriptUrl) {
  return scriptUrl.includes("mockServiceWorker.js");
}, });

if (window.navigator) {
  window.navigator.serviceWorker.ready.then(() => {
    startAtYourService({ registerWorker: false });
  });
}

function App() {
  const [count, setCount] = useState(0);

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
    <div className="App">
      <div>
        <a
          href="https://github.com/AndrewWalsh/at-your-service"
          target="_blank"
        >
          <img src={logo} className="logo react" alt="logo" />
        </a>
      </div>
      <h1>At Your Service</h1>
      <div className="card">
        <button onClick={() => click()}>count is {count}</button>
        <p>
          A <code>live environment</code> and playground for the service worker
        </p>
      </div>
      <p className="read-the-docs">at-your-service</p>
    </div>
  );
}

export default App;
