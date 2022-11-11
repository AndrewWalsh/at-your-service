<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]

<img alt="npm" src="https://img.shields.io/npm/v/at-your-service">

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/AndrewWalsh/at-your-service">
    <img src="resources/logo.svg" alt="Logo">
  </a> -->

<h3 align="center">at-your-service</h3>

  <p align="center">
    Generate OpenAPI 3.1 specifications on the frontend with a click by intercepting requests with <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API">service workers</a> and combining the result
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

<br />
<br />

<!-- ABOUT THE PROJECT -->

[OpenAPI](https://www.openapis.org/) spec generation on the frontend through a service worker proxy.

**Features**

- Generate a basic OpenAPI specification based on real requests/responses
- An extensible interface to generate types from responses for multiple language using [quicktype](https://github.com/quicktype/quicktype)
- **Experimental, it is a POC at this stage**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

`at-your-service` features a CLI tool that places a service worker file into a directory. You likely wish to place this in `public` or `static`, as the service worker needs to be served from the root of your site.

Once this is installed, run the start script in your application code.

### Installation

1. Install NPM package
   ```sh
   npm install at-your-service@alpha
   ```
2. Add service worker to `public`, `static`, or otherwise root directory
   ```sh
   npx at-your-service@alpha <directory>
   ```
3. Run the start script in your application

   ```ts
   import { startAtYourService } from "at-your-service"
   
   startAtYourService()
   ```
4. Use your application, then click `Copy OpenAPI Spec` once sufficient requests have been dispatched to generate a specification with the information you are looking for

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- WHY -->

## Why

You may not have an OpenAPI specification to hand. OpenAPI specifications offer [powerful opportunities](https://openapi.tools/) that are worth making use of. OpenAPI 3.1 specifications are partially supported in [editor-next.swagger.io](https://editor-next.swagger.io/).

Some other envisioned benefits:

- **Convenience**: it's easy to load the service worker, run some requests, and copy the specification
- **Code gen**: there are opportunities for automatic code generation into multiple language on the FE from samples of responses
- **Investigation**: generate specifications from third party sites/applications
- **Dev tooling**: the tool could provide useful information about the network layer while developing an application

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
