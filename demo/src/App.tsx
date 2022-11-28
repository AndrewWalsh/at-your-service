import {
  Box,
  keyframes,
  Link,
  Icon,
  Heading,
  Text,
  Image,
  Kbd,
  Tag,
} from "@chakra-ui/react";
import { SkipNavLink, SkipNavContent } from "@chakra-ui/skip-nav";
import { FaGithub, FaArrowAltCircleDown } from "react-icons/fa";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import Footer from "./Footer";
import HowItWorks from "./HowItWorks";
import BoxOnSWLoad from "./BoxOnSWLoad";
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
              AYS Demo
            </Link>
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
              _hover={{ textDecoration: "underline", color: COLOR_SECONDARY }}
              href="https://awalsh.io/posts/developer-tool-api-discovery-observability-frontend/"
              isExternal
              aria-label="learn more about API discovery and observability"
              position="relative"
            >
              API Observability
              <ExternalLinkIcon
                mx={2}
                paddingBottom="4px"
                color={COLOR_SECONDARY}
                position="absolute"
                top="0"
                height="20px"
                width="20px"
                right="-26px"
              />
            </Link>{" "}
            <Text as="span" marginLeft="10px">
              on the Frontend
            </Text>
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
            for frontend applications that records network requests on the
            browser
            <br />
            <br />
            Generate schemas and code on the fly as you use your app
            <br />
            <br />
          </Text>

          <SkipNavLink
            display="flex"
            position="relative"
            height="100%"
            width="100%"
          >
            <Tag
              size="lg"
              bg={COLOR_SECONDARY}
              color={COLOR_WHITE}
              colorScheme="blue"
              height="100%"
            >
              Try it out below
              <Icon as={FaArrowAltCircleDown} marginLeft="4px" />
            </Tag>
          </SkipNavLink>
        </Box>
        <Box
          maxHeight="90%"
          width="80%"
          marginTop="2vh"
          marginBottom="20vh"
          as="section"
          role="landmark"
        >
          <SkipNavContent />
          <Requester />
        </Box>
      </Box>
      <BoxOnSWLoad />
      <HowItWorks />
      <Footer />
    </Box>
  );
}

export default App;
