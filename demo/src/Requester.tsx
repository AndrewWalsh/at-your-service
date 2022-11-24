import { useState, useEffect } from "react";
import { setupWorker, rest } from "msw";
import { Box } from "@chakra-ui/react";

function Requester() {
  return (
    <Box bg="white">
      <Box display="flex" flexFlow="row nowrap">
        <Box flex="1">request</Box>
        <Box flex="1">response</Box>
      </Box>

      <Box>control bar</Box>
    </Box>
  );
}

export default Requester;
