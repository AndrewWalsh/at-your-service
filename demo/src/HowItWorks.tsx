import { Box, Heading, List, ListItem, ListIcon, Link } from "@chakra-ui/react";
import { FcCommandLine, FcIdea, FcAcceptDatabase } from "react-icons/fc";
import { GiJumpingDog, GiCrystalBall } from "react-icons/gi";

import {
  COLOR_PRIMARY_BORDER,
  COLOR_PRIMARY,
  COLOR_WHITE,
  COLOR_TERTIARY,
} from "./constants";

function HowItWorks() {
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
      <Heading as="h2" marginBottom="10vh">
        How It Works
      </Heading>

      <List spacing={36} maxWidth="800px">
        <ListItem display="flex" flexFlow="row nowrap" alignItems="center">
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

        <ListItem display="flex" flexFlow="row nowrap" alignItems="center">
          <ListIcon
            as={GiJumpingDog}
            color={COLOR_WHITE}
            height="128px"
            width="128px"
          />
          <Heading as="h3" marginLeft="32px">
            Use your application and let it dispatch requests to backend APIs
          </Heading>
        </ListItem>

        <ListItem display="flex" flexFlow="row nowrap" alignItems="center">
          <ListIcon
            as={FcAcceptDatabase}
            color={COLOR_WHITE}
            height="128px"
            width="128px"
          />
          <Heading as="h3" marginLeft="32px">
            Requests are proxied under the hood without any changes to your code
          </Heading>
        </ListItem>

        <ListItem display="flex" flexFlow="row nowrap" alignItems="center">
          <ListIcon
            as={GiCrystalBall}
            color={COLOR_WHITE}
            height="128px"
            width="128px"
          />
          <Heading as="h3" marginLeft="32px">
            Over time, the tool learns what the backend API looks like
          </Heading>
        </ListItem>

        <ListItem display="flex" flexFlow="row nowrap" alignItems="center">
          <ListIcon
            as={FcIdea}
            color={COLOR_TERTIARY}
            height="128px"
            width="128px"
          />
          <Heading as="h3" marginLeft="32px">
            Observe APIs, copy specifications, and generate code from network
            traffic
          </Heading>
        </ListItem>
      </List>
    </Box>
  );
}

export default HowItWorks;
