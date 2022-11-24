import { useRef } from "react";
import { Box, Text } from "@chakra-ui/react";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";

function Requester() {
  const reqRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      border="1px solid #001758"
      borderRadius="1px"
      display="flex"
      flexFlow="column nowrap"
      height="60vh"
      boxSizing="border-box"
    >
      <Box display="flex" flexFlow="row wrap" flex="1" height="100%">
        <Box
          flex="1"
          minWidth="300px"
          border="1px solid #001758"
          boxSizing="border-box"
        >
          <Box height="32px" display="flex" alignItems="center" marginLeft="8px">
            <Text>Request</Text>
          </Box>
          <AceEditor
            mode="json"
            theme="monokai"
            width="100%"
            height="calc(100% - 32px)"
            onChange={() => {}}
            name="UNIQUE_ID_OF_DIV_1"
            editorProps={{ $blockScrolling: true }}
          />
        </Box>
        <Box
          flex="1"
          minWidth="300px"
          border="1px solid #001758"
          boxSizing="border-box"
        >
          <Box height="32px" display="flex" alignItems="center" marginLeft="8px">
            <Text>Response</Text>
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

      <Box minHeight="64px" maxHeight="64px" flex="1">
        control bar
      </Box>
    </Box>
  );
}

export default Requester;
