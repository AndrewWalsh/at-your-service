import { Link, Heading, Text, keyframes } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { COLOR_PRIMARY, COLOR_SECONDARY } from "./constants";

const animatedBg = keyframes`
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
`;

function Title() {
  return (
    <Heading
      as="h1"
      margin="32px 0"
      maxWidth="850px"
    >
      <Link
        bgClip="text"
        bgGradient={`linear-gradient(-45deg, ${COLOR_SECONDARY}, ${COLOR_PRIMARY}, ${COLOR_SECONDARY}, ${COLOR_SECONDARY})`}
        bgSize="400% 400%"
        animation={`${animatedBg} 5s ease-in-out infinite`}
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
  );
}

export default Title;
