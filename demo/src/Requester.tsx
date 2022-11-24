import { useState } from "react";
import { Box, Text, Select, Input, Button, Heading } from "@chakra-ui/react";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";

function Requester() {
  
  return (
    <Box
      borderRadius="1px"
      display="flex"
      flexFlow="column nowrap"
      boxSizing="border-box"
    >
      <Box display="flex" flexFlow="row wrap" flex="1" height="100%" gap={6}>
        <Box
          flex="1"
          minWidth="300px"
          boxSizing="border-box"
          role="dialog"
          aria-labelledby="dialog1Title"
          minHeight="384px"
        >
          <Box height="32px" display="flex" alignItems="center">
            <Heading as="h6" size="md" id="dialog1Title">Request</Heading>
          </Box>
          <AceEditor
            mode="json"
            theme="monokai"
            width="100%"
            height="calc(100% - 32px)"
            value="null"
            onChange={() => {}}
            name="UNIQUE_ID_OF_DIV_1"
            editorProps={{ $blockScrolling: true }}
          />
        </Box>
        <Box
          flex="1"
          minWidth="300px"
          boxSizing="border-box"
          role="dialog"
          aria-labelledby="dialog2Title"
          minHeight="384px"
        >
          <Box height="32px" display="flex" alignItems="center">
            <Heading as="h6" size="md" id="dialog2Title">Response</Heading>
          </Box>
          <AceEditor
            mode="json"
            theme="monokai"
            width="100%"
            height="calc(100% - 32px)"
            onChange={() => {}}
            name="UNIQUE_ID_OF_DIV_2"
            editorProps={{ $blockScrolling: true }}
          />
        </Box>
      </Box>

      <Box
        minHeight="64px"
        maxHeight="64px"
        flex="1"
        display="flex"
        alignItems="center"
        flexFlow="row wrap"
        gap={2}
        marginTop="8px"
      >
        <Button>
          Send
        </Button>
        <Text whiteSpace="nowrap" fontWeight="bold">a</Text>

        <Select width="auto">
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
          <option value="POST">POST</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </Select>

        <Text whiteSpace="nowrap">request to</Text>

        <Input value="http//example.com" size="md" width="auto" />

        <Text whiteSpace="nowrap">at path</Text>

        <Input value="/api" size="md" width="auto" />

        <Text whiteSpace="nowrap">returning status</Text>

        <Select width="auto">
          <option value="200">200</option>
          <option value="400">400</option>
        </Select>
      </Box>
    </Box>
  );
}

export default Requester;
