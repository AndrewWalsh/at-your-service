import {
  Box,
  keyframes,
  Link,
  Icon,
  Heading,
  Text,
  Image,
  Code,
  Kbd,
  Tag,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import Requester from "./Requester";
import {
  COLOR_PRIMARY_BORDER,
  COLOR_WHITE,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
} from "./constants";

import logo from "./assets/logo.png";

const grow = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

function App() {
  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexFlow="column nowrap"
      position="relative"
      paddingBottom="400px"
    >
      <Box
        border={`2px solid ${COLOR_PRIMARY_BORDER}`}
        boxSizing="border-box"
        bg={COLOR_PRIMARY}
        width="100%"
        maxHeight="64px"
        minHeight="64px"
        flex="1"
        display="flex"
        flexFlow="row nowrap"
        alignItems="center"
        justifyContent="center"
        padding="0 32px"
        color="white"
        as="header"
      >
        <Box
          marginRight="auto"
          display="flex"
          flexFlow="row nowrap"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            height="32px"
            width="32px"
            border={`1px solid ${COLOR_WHITE}`}
            boxSizing="border-box"
            borderRadius="50%"
            bg="white"
            marginRight="16px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={logo} height="24px" alt="logo" />
          </Box>
          <Heading as="h2" size="md">
            <Link
              isExternal
              href="https://andrewwalsh.github.io/at-your-service/"
              aria-label="live demo playground of at-your-service"
            >
              Demo
            </Link>
            <Code marginLeft="8px">Alpha</Code>
          </Heading>
        </Box>
        <Link
          href="https://github.com/AndrewWalsh/at-your-service"
          aria-label="repository"
          isExternal
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          color="white"
        >
          <Icon as={FaGithub} />
          <Text>
            {" GitHub "}
            <ExternalLinkIcon mx={2} paddingBottom="4px" />
          </Text>
        </Link>
      </Box>

      <Box
        width="100%"
        flex="1"
        justifyContent="center"
        display="flex"
        position="relative"
        as="main"
        flexFlow="column nowrap"
        alignItems="center"
        marginTop="1em"
      >
        <Box
          as="article"
          display="flex"
          alignItems="flex-start"
          width="80%"
          flexFlow="column nowrap"
        >
          <Heading as="h1" margin="32px 0" maxWidth="850px">
            <Link
              bgGradient={`linear(to bottom, ${COLOR_PRIMARY}, ${COLOR_SECONDARY})`}
              bgClip="text"
              href="https://awalsh.io/posts/developer-tool-api-discovery-observability-frontend/"
              isExternal
              aria-label="learn more about API discovery and observability"
            >
              API Observability
            </Link>{" "}
            on the Frontend
            <br />
            <br />
            <Heading as="span" fontSize="24px">
              Generate{" "}
              <Link
                href="https://www.openapis.org/"
                isExternal
                aria-label="openapi initiative"
                color={COLOR_SECONDARY}
              >
                OpenAPI
              </Link>{" "}
              specifications and{" "}
              <Link
                href="https://quicktype.io/"
                aria-label="the library that generates code from JSON Schema"
                isExternal
                color={COLOR_SECONDARY}
              >
                model code
              </Link>{" "}
              automatically from network requests using{" "}
              <Link
                href="https://web.dev/learn/pwa/service-workers/"
                aria-label="learn more about service workers"
                isExternal
                color={COLOR_SECONDARY}
              >
                service workers
              </Link>{" "}
            </Heading>
          </Heading>
          <Text maxWidth="650px">
            <Kbd>at-your-service</Kbd> is an open source{" "}
            <Link
              href="https://www.npmjs.com/package/at-your-service"
              aria-label="learn more about the tool"
              isExternal
              color={COLOR_SECONDARY}
              fontWeight="bold"
            >
              developer tool
            </Link>{" "}
            for frontend applications that records network requests as they
            happen in the browser
            <br />
            <br />
            It uses this information to eludicate backend APIs, create schemas,
            and generate model code/types
            <br />
            <br />
            <Tag
              size="lg"
              bg={COLOR_SECONDARY}
              color={COLOR_WHITE}
              colorScheme="blue"
            >
              Try it out below
            </Tag>
            <br />
            <br />
          </Text>
        </Box>
        <Box
          maxHeight="90%"
          width="80%"
          marginTop="2vh"
          marginBottom="20vh"
          as="section"
          role="landmark"
        >
          <Requester />
        </Box>
      </Box>
      <Box
        position="fixed"
        border={`1px solid ${COLOR_PRIMARY_BORDER}`}
        bg={COLOR_PRIMARY}
        boxSizing="border-box"
        height="512px"
        borderRadius="8px"
        width="512px"
        left="-308px"
        bottom="-440px"
        animation={`${grow} 0.5s ease-in`}
        role="presentation"
        zIndex="900"
      ></Box>
    </Box>
  );
}

export default App;
