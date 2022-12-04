<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]
<a href="https://www.npmjs.com/package/at-your-service"><img alt="npm" src="https://img.shields.io/npm/v/at-your-service?style=for-the-badge"></a>
<a href="https://atyourservice.awalsh.io/"><img alt="npm" src="https://img.shields.io/badge/View%20-Live%20Demo-blueviolet?style=for-the-badge"></a>

<a href="https://github.com/AndrewWalsh/at-your-service/actions"><img alt="npm" src="https://github.com/AndrewWalsh/at-your-service/actions/workflows/node.js.yml/badge.svg"></a>
<a href="https://codeclimate.com/github/AndrewWalsh/at-your-service/test_coverage"><img src="https://api.codeclimate.com/v1/badges/56fa1f99da7509735cee/test_coverage" /></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/AndrewWalsh/at-your-service">
    <img src="https://raw.githubusercontent.com/AndrewWalsh/at-your-service/main/resources/logo-floor.png" alt="Logo">
  </a>

  <br />
  <h2 align="center">at-your-service</h2>
  <br />

  <p align="center">
    <blockquote>
        A frontend developer tool that autogenerates OpenAPI 3.1 specifications and code for any app via a service worker proxy
        <br />
        <br />
        Designed for ease of use. Zero config & no requirement to integrate with existing code
      </blockquote>
      <br />
      <br />
      🚧 <code>Alpha</code> 🚧
      <br />
      <br />
      <br />
      <a href="https://atyourservice.awalsh.io/">View the Live Demo</a>
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

<a href="https://atyourservice.awalsh.io/"><img alt="npm" src="https://img.shields.io/badge/View%20-Live%20Demo-blueviolet"></a>

Frontend developers often work on legacy projects that rely on backend services that are undocumented. Since they are undocumented, dealing with requests and responses is an immense hassle. The ideal solution to this problem is to document the backend, but in practice this can be immensely challenging.

This tool is designed to help with tackle problems that arise from a lack of awareness on API behaviour.

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

More information on the rationale, functionality, and architecture of the tool [can be found here](https://awalsh.io/posts/developer-tool-api-discovery-observability-frontend/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIMITATIONS -->

## Limitations

The library creates specifications that are only as accurate as the underlying observations. If your application relies on a response body that has not been observed, then type information for it will not be available. In addition, the underlying sampling algorithm is fairly basic.

Overall the intent is to produce a *best guess* that reveals API behaviour. This will never be a replacement for proper documentation.

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
