import { useState, useEffect } from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import {
  Box,
  Link,
  Icon,
  Heading,
  Text,
  Image,
  Kbd,
  Tag,
  Stack,
  Button,
} from "@chakra-ui/react";
import { COLOR_PRIMARY, COLOR_PRIMARY_BORDER } from "./constants";

export default function SkeletonLanding() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <Stack padding={4} spacing={1} width="300px">
      <Skeleton
        height="40px"
        isLoaded={isLoaded}
        startColor={COLOR_PRIMARY}
        endColor={COLOR_PRIMARY}
      >
        <Text fontWeight="bold">Collects network traffic</Text>
      </Skeleton>
      <Skeleton
        height="40px"
        isLoaded={isLoaded}
        fadeDuration={2}
        startColor={COLOR_PRIMARY}
        endColor={COLOR_PRIMARY}
      >
        <Text>Without integrating with code</Text>
      </Skeleton>
      <Skeleton
        height="40px"
        isLoaded={isLoaded}
        fadeDuration={4}
        startColor={COLOR_PRIMARY}
        endColor={COLOR_PRIMARY}
      >
        <Text>In browser environments</Text>
      </Skeleton>

      <Box>
        <Button onClick={() => setIsLoaded((v) => !v)}>Collecting samples ...</Button>
      </Box>
    </Stack>
  );
}
