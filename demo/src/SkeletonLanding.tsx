import { useState } from "react";
import { Skeleton } from "@chakra-ui/react";
import { Box, Text, Stack, Button } from "@chakra-ui/react";

export default function SkeletonLanding() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <Stack padding={4} spacing={1} width="300px">
      <Skeleton
        height="40px"
        isLoaded={isLoaded}
        startColor="gray.300"
        endColor="gray.300"
      >
        <Text fontWeight="bold">Collects network traffic</Text>
      </Skeleton>
      <Skeleton
        height="40px"
        isLoaded={isLoaded}
        fadeDuration={2}
        startColor="gray.300"
        endColor="gray.300"
      >
        <Text>Without integrating with code</Text>
      </Skeleton>
      <Skeleton
        height="40px"
        isLoaded={isLoaded}
        fadeDuration={4}
        startColor="gray.300"
        endColor="gray.300"
      >
        <Text>In browser environments</Text>
      </Skeleton>

      <Box>
        <Button onClick={() => setIsLoaded((v) => !v)}>
          Collecting samples ...
        </Button>
      </Box>
    </Stack>
  );
}
