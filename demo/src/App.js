import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { setupWorker, rest } from "msw";
// import { startAtYourService } from "at-your-service";
import { startAtYourService } from "../../src";
// @ts-expect-error
import logo from "./assets/logo.png";
import "./App.css";
const LOCALHOST_API = "http://localhost:8080";
const worker = setupWorker(rest.get("http://localhost:8080/hello", (req, res, ctx) => {
    return res(ctx.delay(1500), ctx.status(202, "Mocked status"), ctx.json({
        message: "Mocked response JSON body",
    }));
}));
worker.start();
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
    return (_jsxs("div", Object.assign({ className: "App" }, { children: [_jsx("div", { children: _jsx("a", Object.assign({ href: "https://github.com/AndrewWalsh/at-your-service", target: "_blank" }, { children: _jsx("img", { src: logo, className: "logo react", alt: "logo" }) })) }), _jsx("h1", { children: "At Your Service" }), _jsxs("div", Object.assign({ className: "card" }, { children: [_jsxs("button", Object.assign({ onClick: () => click() }, { children: ["count is ", count] })), _jsxs("p", { children: ["A ", _jsx("code", { children: "live environment" }), " and playground for the service worker"] })] })), _jsx("p", Object.assign({ className: "read-the-docs" }, { children: "at-your-service" }))] })));
}
export default App;
