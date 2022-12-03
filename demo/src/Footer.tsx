import { Box, Link, Icon } from "@chakra-ui/react";
import { DiGithubFull, DiNpm } from "react-icons/di";

function Footer() {
  return (
    <Box
      display="flex"
      flexFlow="row wrap"
      justifyContent="center"
      as="section"
      width="100%"
      padding="20vh 10vh"
      marginBottom="10vh"
      gap={8}
    >
      <Link href="https://github.com/AndrewWalsh/at-your-service" isExternal>
        <Icon as={DiGithubFull} height="128px" width="128px" />
      </Link>
      <Link href="https://www.npmjs.com/package/at-your-service" isExternal>
        <Icon as={DiNpm} height="128px" width="128px" />
      </Link>
    </Box>
  );
}

export default Footer;
