<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]

<img alt="npm" src="https://img.shields.io/npm/v/at-your-service">

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/AndrewWalsh/at-your-service">
    <img src="https://raw.githubusercontent.com/AndrewWalsh/at-your-service/main/resources/logo.png" alt="Logo">
  </a>

<br />
<h3 align="center">at-your-service</h3>
<br />

  <p align="center">
    🔭 A frontend development tool that uses service workers to automatically create OpenAPI 3.1 specifications and generate code from network request/response bodies in 10+ languages
    <br />
    <br />
    👷 <code>alpha</code> / <code>POC</code> 👷
    <br />
    <br />
    <br />
    <a href="https://github.com/AndrewWalsh/at-your-service/issues">Report Bug</a>
    ·
    <a href="https://www.npmjs.com/package/at-your-service">View on npm</a>
  </p>
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/AndrewWalsh/at-your-service/main/resources/ays-demo.png" alt="banner">
</div>

<br />
<br />

`at-your-service` is a dev tool for code and spec generation from network requests on the frontend.

It installs a service worker that acts as a proxy and sends requests and responses to a client. That client stores this information efficiently and provides the ability to create a complete OpenAPI specification from the network requests that have executed since the client began.

It can also generate code samples from request/response bodies. These samples reflect the type information in these bodies.

**Features**

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

### Installation

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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- WHY DO THIS -->

## Why Do This

You may not have an OpenAPI specification to hand. OpenAPI specifications have [a variety of applications](https://openapi.tools/) that can be extremely useful and save countless hours of development time. For example you can automatically [generate API client libraries, stubs, and documentation](https://github.com/OpenAPITools/openapi-generator). OpenAPI 3.1 specifications are partially supported in [editor-next.swagger.io](https://editor-next.swagger.io/) and will be the standard going forwards.

There are a few reasons to do this on the frontend specifically:

- It mitigates issues around accounting for the topology of the backend. In other words, the frontent may call out to a multitude of services and we would otherwise have to aggregate the specifications of those services in order to provide a full specification for the system from the perspective of the frontend
- There are opportunities to investigate third party services through use of this tool
- The process could be automated using tools such as [Puppeteer](https://github.com/puppeteer/puppeteer) to serve specific use cases
- There are opportunities to provide tooling for observability on network requests in real time. This is a common source of issues for frontend developers

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- HOW IT WORKS -->

## How It Works

[Service workers](https://www.freecodecamp.org/news/service-workers-the-little-heroes-behind-progressive-web-apps-431cc22d0f16/) are a special form of web worker that underpin advanced functionalities in [PWAs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps). Once installed they have a variety of applications. The application that this library makes use of is their potential to act as a [proxy](https://www.freecodecamp.org/news/what-is-a-proxy-server-in-english-please/).

A *"service worker"* itself is just a file containing function calls and other behaviour specific to the context of a service worker. Libraries such as Google's [Workbox](https://developer.chrome.com/docs/workbox/) exist to ease development of service workers specifically. This library features a custom service worker script that performs a very specific role. It captures *request* / *response* pairs and emits these as events.

The client captures these events and places them into an optimised data structure. Request and response bodies are parsed before storage. Each property is [zeroed](https://yourbasic.org/golang/default-zero-value/) as only the type itself is relevant for sake of spec and code gen. When a request or response body differs for the same path the sample is stored alongside existing samples. This means that code and spec generation accounts for the full spectrum of type information given the observations from the network requests that have occurred since the `at-your-service` tool was started.

The functionality of the application with regard to spec and code gen is nothing more than a conversion operation on the data structure above.

This information is visible in the drawer that can be opened by clicking on the button that shows once the library has started.

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
