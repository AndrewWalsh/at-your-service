import {
  Box,
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
import Title from "./Title";
import AnimationEffect from "./AnimationEffect";
import SkeletonLanding from "./SkeletonLanding";
import {
  COLOR_PRIMARY_BORDER,
  COLOR_WHITE,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
} from "./constants";

import useWindowSize from "./useWindowSize";
import logo from "./assets/logo.png";

function App() {
  const { width } = useWindowSize();
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
              href="https://atyourservice.awalsh.io/"
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
          position="absolute"
          height="100%"
          width="10vw"
          top="0"
          left="0"
          overflow="hidden"
        >
          <Box
            position="absolute"
            height="100%"
            width="calc(10vw + 40px)"
            top="-20px"
            left="-50px"
            overflow="hidden"
            role="presentation"
          >
            <AnimationEffect bg={COLOR_PRIMARY} />
          </Box>
        </Box>

        <Box
          position="absolute"
          height="100%"
          width="10vw"
          top="0"
          right="0"
          overflow="hidden"
        >
          <Box
            position="absolute"
            height="100%"
            width="calc(10vw + 50px)"
            top="-20px"
            left="-50px"
            overflow="hidden"
            role="presentation"
          >
            <AnimationEffect bg={COLOR_SECONDARY} />
          </Box>
        </Box>
        <Box
          as="section"
          display="flex"
          alignItems="flex-start"
          width="80vw"
          flexFlow="row nowrap"
        >
          <Box
            as="article"
            display="flex"
            alignItems="flex-start"
            maxWidth="700px"
            width="700px"
            flexFlow="column nowrap"
            flexGrow="1"
          >
            <Title />
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
              Observe API behaviour, create schemas, and generate code on the
              fly
              <br />
              <br />
            </Text>

            <SkipNavLink
              id="demo"
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

          {Boolean(width) && width! > 1100 && (
            <Box
              display="flex"
              height="100%"
              alignItems="center"
              justifyContent="center"
              flexGrow="1"
            >
              <SkeletonLanding />
            </Box>
          )}
        </Box>
        <Box
          maxHeight="90%"
          width="80%"
          marginTop="2vh"
          marginBottom="20vh"
          as="section"
          role="landmark"
        >
          <SkipNavContent id="demo" />
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
