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

<h3 align="center">at-your-service</h3>

  <p align="center">
    An easy-install development tool leveraging service workers as proxies to generate OpenAPI 3.1 specifications and models/serializers in 10+ languages directly on the frontend
    <br />
    <br />
    👷 alpha / experimental 👷
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

`at-your-service` is a dev tool for code and spec generation from network requests on the frontend. It is designed to be simple to install and explore in an existing application.

This project uses service workers as proxies to collect information about requests over time. It uses this information to generate OpenAPI 3.1 specifications and allow model code generation of response or request bodies into multiple languages.

**Features**

- Generate [OpenAPI 3.1](https://www.openapis.org/blog/2021/02/18/openapi-specification-3-1-released) specifications with [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/release-notes.html) data types with a single click
- Minimal config. There is no need to integrate any code whatsoever, just install the service worker and run the start function
- View your requests in a tree view for further inspection
- Generate models for 10+ languages including TypeScript, Python, JSON Schema, and even Haskell at the click of a button through integration with [quicktype](https://github.com/quicktype/quicktype)
- **Experimental, it is a POC at this stage and is in an alpha state**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

`at-your-service` features a CLI tool that places a service worker file into a directory. You likely wish to place this in `public` or `static` (see [more information here](https://mswjs.io/docs/getting-started/integrate/browser#where-is-my-public-directory)), as the service worker needs to be served from the root of your site.

Once this is installed, run the start script in your application code.

### Installation

1. Install npm package
   ```sh
   npm install -D at-your-service@latest
   ```
2. Add service worker to `public`, `static`, or otherwise root directory
   ```sh
   npx at-your-service@latest <directory>
   ```
3. Run the start script in your application

   ```ts
   import { startAtYourService } from "at-your-service";

   startAtYourService();
   ```

4. Use your application, then click `Copy OpenAPI Spec` once sufficient requests have been dispatched to generate a specification with the information you are looking for

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- WHY DO THIS -->

## Why Do This

You may not have an OpenAPI specification to hand. OpenAPI specifications offer [powerful opportunities](https://openapi.tools/) that are worth making use of. OpenAPI 3.1 specifications are partially supported in [editor-next.swagger.io](https://editor-next.swagger.io/).

Some other envisioned benefits:

- **Convenience**: it's easy to load the service worker, run some requests, and copy the specification
- **Code gen**: there are opportunities for automatic code generation into multiple language on the FE from samples of responses
- **Investigation**: generate specifications from third party sites/applications, or see what requests were dispatched following a particular use of an application using a tool such as [Puppeteer](https://github.com/puppeteer/puppeteer)
- **Dev tooling**: the tool could provide useful information about the network layer while developing an application

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- HOW IT WORKS -->

## How It Works

[Service workers](https://www.freecodecamp.org/news/service-workers-the-little-heroes-behind-progressive-web-apps-431cc22d0f16/) are a special form of web worker that underpin advanced functionalities in progressive web applications. Once installed they have a variety of applications. The application that this library makes use of is their potential to act as a [proxy](https://www.freecodecamp.org/news/what-is-a-proxy-server-in-english-please/).

A "service worker" itself is just a file containing functional calls and other behaviour specific to the context of a service worker. Libraries such as Google's [Workbox](https://developer.chrome.com/docs/workbox/) exist to ease development of service workers specifically. This library features a custom service worker script that performs a very specific role. It captures *request* / *response* pairs and emits these as events.

The client captures these events and collects them into an approriate data structure. Querying that data structure enables a multitude of possibilities.

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
