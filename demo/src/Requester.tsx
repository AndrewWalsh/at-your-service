import { useState, useEffect } from "react";
import { setupWorker, rest } from "msw";
import { Box } from "@chakra-ui/react";

function Requester() {
  return (
    <Box border="1px solid black" display="flex" flexFlow="column nowrap" height="60vh"  boxSizing="border-box">
      <Box display="flex" flexFlow="row wrap" flex="1" height="100%">
        <Box flex="1" minWidth="300px" border="1px solid black" boxSizing="border-box">request</Box>
        <Box flex="1" minWidth="300px" border="1px solid black" boxSizing="border-box">response</Box>
      </Box>

      <Box minHeight="64px" maxHeight="64px" flex="1">control bar</Box>
    </Box>
  );
}

export default Requester;
