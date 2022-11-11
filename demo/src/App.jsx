import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

const LOCALHOST_API = "http://localhost:8080";

function App() {
  const [count, setCount] = useState(0);

  const click = () => {
    fetch(`${LOCALHOST_API}/hello`).then(() => {});
    fetch(
      `${LOCALHOST_API}/requires/996a27ec-cdfb-4ca6-a458-e6f7a4870325/info?hi=aa`
    ).then(() => {});
    fetch(
      `${LOCALHOST_API}/requires/996a27ec-cdfb-4ca6-a458-e6f7a4870325/info?hi=1`
    ).then(() => {});
    setCount(count + 1);
  };

  return (
    <div className="App">
      <div>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>At Your Service</h1>
      <div className="card">
        <button onClick={click}>count is {count}</button>
        <p>
          A <code>live environment</code> and playground for the service worker
        </p>
      </div>
      <p className="read-the-docs">at-your-service</p>
    </div>
  );
}

export default App;
