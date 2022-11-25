<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]

<a href="https://codeclimate.com/github/AndrewWalsh/at-your-service/test_coverage"><img src="https://api.codeclimate.com/v1/badges/56fa1f99da7509735cee/test_coverage" /></a>
<img alt="npm" src="https://github.com/AndrewWalsh/at-your-service/actions/workflows/node.js.yml/badge.svg">
<img alt="npm" src="https://img.shields.io/npm/v/at-your-service">


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/AndrewWalsh/at-your-service">
    <img src="https://raw.githubusercontent.com/AndrewWalsh/at-your-service/main/resources/logo-floor.png" alt="Logo">
  </a>

  <br />
  <h3 align="center">at-your-service</h3>
  <br />

  <p align="center">
    <blockquote>
        A frontend developer tool for API observability, OpenAPI schema creation, and code generation
        <br />
        <br />
        Records network requests as they happen and offers schema and code generation capabilities
        <br />
        <br />
        Minimal fuss installation. No integration with API library code required. Proxies under the hood using service workers
      </blockquote>
      <br />
      <br />
      🚧 <code>alpha</code> 🚧
      <br />
      <br />
      <br />
      <a href="https://andrewwalsh.github.io/at-your-service/">See It in Action in the Demo Playground</a>
      <br />
      <br />
      <a href="https://github.com/AndrewWalsh/at-your-service/issues">Report Bug</a>
      ·
      <a href="https://www.npmjs.com/package/at-your-service">View on npm</a>
  </p>
</div>

<br />
<hr />
<br />

<!-- TABLE OF CONTENTS -->

<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project-and-why">About The Project and Why</a>
    </li>
    <li>
      <a href="#features">Features</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li>
      <a href="#how-it-works">How it Works</a>
    </li>
    <li>
      <a href="#limitations">Limitations</a>
    </li>
    <li>
      <a href="#license">License</a>
    </li>
  </ol>
</details>

<br />

<!-- ABOUT THE PROJECT AND WHY -->

## About the Project and Why

Frontend developers often work on legacy projects that rely on backend services that are undocumented. Since they are undocumented, dealing with requests and responses is an immense hassle. The ideal solution to this problem is to document the backend, but in practice this can be immensely challenging.

There are several ways of programatically generating an OpenAPI specification for an existing backend service. Examples include schema generation [from code](https://www.blazemeter.com/blog/openapi-spec-from-code), [intercepted requests/responses via a proxy](https://apievangelist.com/2017/07/20/charles-proxy-generated-har-to-openapi-using-api-transformer/), and recently [commercial offerings that derive a specification from network observations](https://www.akitasoftware.com/). These solutions may or may not work for you.

**Generating specifications and documentation is hard**

Generating a schema from code only works if the backend deserialises all data into defined structures. Without this schema generation tools such as [drf-spectacular](https://drf-spectacular.readthedocs.io/en/latest/) cannot generate an accurate specification as the underlying data models are not known.

Using a proxy lets you [generate an OpenAPI specification from HTTP traffic](https://apisyouwonthate.com/blog/creating-openapi-from-http-traffic). This can be achieved locally with a proxy such as [Charles](https://www.charlesproxy.com/) that intercepts network requests and emits a [HAR](https://en.wikipedia.org/wiki/HAR_(file_format)) file. Tools such as [har-to-openapi](https://github.com/jonluca/har-to-openapi) can then convert this file into a specification. This is an effective approach as it uses real network observations and doesn't rely on assumptions in code.

**Addressing network observability on the frontend itself**

So if using a proxy for the purpose of gaining insight into what backend services are doing is an effective solution, why isn't it more commonplace? Because it's extremely cumbersome in practice. The config involved is non-trivial and without a considerable time investment in automation it is a very manually involved process.

`at-your-service` sidesteps this hassle entirely by installing a proxy on the frontend directly. There is nothing to configure or setup. The frontend is where all network requests converge and all underlying services it calls out to are accounted for.

When the tool is installed it records API requests and responses independently without affecting your application. It can produce an OpenAPI specification from these. This specification is a best-effort guess based on observations.

It can also generate code such as TypeScript definitions for responses from backend APIs. For example, if you have a response that returns variously both `{ dog: "collie" }` and `{ dog: null }` then the tool can produce model code for serialization into many languages thanks to [quicktype](https://github.com/quicktype/quicktype) under the hood. This translates into a data structure where `dog` is of [JSON type](https://cswr.github.io/JsonSchema/spec/basic_types/) `string` or `null`. All type information that can be derived from observations is accounted.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->

## Features

- **Spec gen**: generate [OpenAPI 3.1](https://www.openapis.org/blog/2021/02/18/openapi-specification-3-1-released) specifications with valid [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/release-notes.html) request/response bodies
- **Code gen**: convert network response bodies into code models for 10+ languages including TypeScript, Python, JSON Schema thanks to integration with [quicktype](https://github.com/quicktype/quicktype)
- **Observability**: view all requests that have transpired since starting the dev tool in a tree view
- **Easy install**: minimal fuss setup that "just works". Thanks to service workers no integration with your code is required
- **Experimental**: it is a proof of concept at this stage

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

`at-your-service` features a CLI tool that places its service worker file into a directory. You likely wish to place this in `public` or `static`. See [more information here](https://mswjs.io/docs/getting-started/integrate/browser#where-is-my-public-directory) on common locations for static files.

The service worker must be served from the root of your site. Once this is installed run the start script in your application code.

1. Install the npm package
   ```sh
   npm install -D at-your-service@latest
   ```
2. Add service worker to your `public`, `static`, or otherwise root directory
   ```sh
   npx at-your-service@latest <directory>
   ```
3. Run the start script in your application

   ```ts
   import { startAtYourService } from "at-your-service";

   startAtYourService();
   ```

4. A button to open the drawer will be visible on your site
5. You can view copied OpenAPI 3.1 specifications in [editor-next.swagger.io](https://editor-next.swagger.io/). At the time of writing, you need to manually change the version from `3.1.0` to `3.0.0` after pasting the specification. Support for the new version of the specifcation is an ongoing process

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- HOW IT WORKS -->

## How It Works

[Service workers](https://www.freecodecamp.org/news/service-workers-the-little-heroes-behind-progressive-web-apps-431cc22d0f16/) are a special form of web worker that underpin advanced functionalities in [PWAs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps). Once installed they have a variety of applications. The application that this library makes use of is their potential to act as a [proxy](https://www.freecodecamp.org/news/what-is-a-proxy-server-in-english-please/).

A *"service worker"* itself is just a file containing function calls and other behaviour specific to the context of a service worker. Libraries such as Google's [Workbox](https://developer.chrome.com/docs/workbox/) exist to ease development of service workers specifically. This library features a custom service worker script that performs a very specific role. It captures *request* / *response* pairs and emits these as events.

The main client captures these events and places them into an optimised data structure. Request and response bodies are parsed before storage. Each property is [zeroed](https://yourbasic.org/golang/default-zero-value/) as only the type itself is relevant for sake of spec and code gen. When a request or response body differs for the same path the sample is stored alongside existing samples. This means that code and spec generation accounts for the full spectrum of type information given the observations from the network requests that have occurred since the `at-your-service` tool began.

The functionality of the application with regard to spec and code gen is nothing more than a conversion operation on the data structure above.

This information is visible in the drawer that can be opened by clicking on the button that shows once the library has started.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIMITATIONS -->

## Limitations

The library creates specifications that are only as accurate as the underlying observations. If your application relies on a response body that has not been observed, then type information for it will not be available.

Overall the intent is to produce a "best guess" that reveals API behaviour. This will never be a replacement for proper documentation.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/AndrewWalsh/at-your-service.svg?style=for-the-badge
[contributors-url]: https://github.com/AndrewWalsh/at-your-service/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/AndrewWalsh/at-your-service.svg?style=for-the-badge
[forks-url]: https://github.com/AndrewWalsh/at-your-service/network/members
[stars-shield]: https://img.shields.io/github/stars/AndrewWalsh/at-your-service.svg?style=for-the-badge
[stars-url]: https://github.com/AndrewWalsh/at-your-service/stargazers
[issues-shield]: https://img.shields.io/github/issues/AndrewWalsh/at-your-service.svg?style=for-the-badge
[issues-url]: https://github.com/AndrewWalsh/at-your-service/issues
[license-shield]: https://img.shields.io/github/license/AndrewWalsh/at-your-service.svg?style=for-the-badge
[license-url]: https://github.com/AndrewWalsh/at-your-service/blob/master/LICENSE
