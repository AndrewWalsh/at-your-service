import { Box, Heading, List, ListItem, ListIcon, Link } from "@chakra-ui/react";
import { FcCommandLine, FcIdea, FcAcceptDatabase } from "react-icons/fc";
import { GiJumpingDog, GiCrystalBall } from "react-icons/gi";

import useWindowSize from "./useWindowSize";

import {
  COLOR_PRIMARY_BORDER,
  COLOR_PRIMARY,
  COLOR_WHITE,
  COLOR_TERTIARY,
} from "./constants";

function HowItWorks() {
  const { width } = useWindowSize();

  const flexFlow = width && width > 600 ? "row nowrap" : "column nowrap";

  return (
    <Box
      display="flex"
      flexFlow="column nowrap"
      alignItems="center"
      as="section"
      width="100%"
      bg={COLOR_PRIMARY}
      borderTop={`2px solid ${COLOR_PRIMARY_BORDER}`}
      borderBottom={`2px solid ${COLOR_PRIMARY_BORDER}`}
      padding="20vh 10vh"
      color={COLOR_WHITE}
    >
      <Heading as="h2" marginBottom="10vh" borderBottom="4px dashed white">
        How It Works
      </Heading>

      <List spacing={36} maxWidth="800px">
        <ListItem display="flex" flexFlow={flexFlow} alignItems="center">
          <ListIcon
            as={FcCommandLine}
            color={COLOR_WHITE}
            height="128px"
            width="128px"
          />
          <Heading as="h3" marginLeft="32px">
            Read the{" "}
            <Link
              color={COLOR_TERTIARY}
              href="https://github.com/AndrewWalsh/at-your-service#getting-started"
              isExternal
            >
              Getting Started
            </Link>{" "}
            guide and install the tool
          </Heading>
        </ListItem>

        <ListItem display="flex" flexFlow={flexFlow} alignItems="center">
          <ListIcon
            as={GiJumpingDog}
            color={COLOR_WHITE}
            height="128px"
            width="128px"
          />
          <Heading as="h3" marginLeft="32px">
            Use your application and trigger requests to backend APIs
          </Heading>
        </ListItem>

        <ListItem display="flex" flexFlow={flexFlow} alignItems="center">
          <ListIcon
            as={FcAcceptDatabase}
            color={COLOR_WHITE}
            height="128px"
            width="128px"
          />
          <Heading as="h3" marginLeft="32px">
            A service worker proxy continually sends information to the client
            on the browser
          </Heading>
        </ListItem>

        <ListItem display="flex" flexFlow={flexFlow} alignItems="center">
          <ListIcon
            as={GiCrystalBall}
            color={COLOR_WHITE}
            height="128px"
            width="128px"
          />
          <Heading as="h3" marginLeft="32px">
            The tool learns about the structure of backend APIs as it collects
            information over time
          </Heading>
        </ListItem>

        <ListItem display="flex" flexFlow={flexFlow} alignItems="center">
          <ListIcon
            as={FcIdea}
            color={COLOR_TERTIARY}
            height="128px"
            width="128px"
          />
          <Heading as="h3" marginLeft="32px">
            Prototype applications and discover API behaviour from network
            traffic
          </Heading>
        </ListItem>
      </List>
    </Box>
  );
}

export default HowItWorks;
