import { Box, keyframes } from "@chakra-ui/react";

import { COLOR_PRIMARY_BORDER, COLOR_PRIMARY } from "./constants";
import useSWIsReady from "./useSWIsReady";

const grow = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

function BoxOnSWLoad() {
  const show = useSWIsReady();
  if (!show) {
    return null;
  }
  return (
    <Box
      position="fixed"
      border={`1px solid ${COLOR_PRIMARY_BORDER}`}
      bg={COLOR_PRIMARY}
      boxSizing="border-box"
      height="512px"
      borderRadius="8px"
      width="512px"
      left="-308px"
      bottom="-440px"
      animation={`${grow} 0.5s ease-in`}
      role="presentation"
      zIndex="998"
    ></Box>
  );
}

export default BoxOnSWLoad;
