import { Box, keyframes } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { uniqueId } from "lodash";

import { COLOR_PRIMARY } from "./constants";

const fadeInOut = keyframes`
0%,100% { opacity: 0 }
50% { opacity: 0.5 }
0% { scale: 0.2 }
30% { scale: 0.7 }
100% { scale: 1 }
`;

type Item = {
  id: string;
  height: string;
  width: string;
  top: string;
  horizontal: string;
};

// In seconds
const DURATION = 5;
const QUANTITY_TO_GEN = 20;

function AnimationEffect() {
  const [items, setItems] = useState<Array<Item>>([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const howMany = Math.floor(Math.random() * QUANTITY_TO_GEN) + 1;
      const newItems: Array<Item> = [];
      for (let i = 0; i < howMany; i++) {
        const height = `${Math.floor(Math.random() * 40) + 1}px`;
        // Bias towards top items from distribution
        const topItems: Array<number> = [];
        for (let i = 0; i < 3; i++) {
          topItems.push(Math.floor(Math.random() * 90));
        }
        topItems.sort();
        newItems.push({
          id: uniqueId(),
          height,
          width: height,
          // Bias towards the top
          top: `${topItems[-1] + 1}%`,
          horizontal: `calc(${Math.floor(Math.random() * 100) + 1}% - ${height})`,
        });
      }
      setItems(newItems);
    }, DURATION * 1000);
    return () => clearTimeout(timeout);
  }, [items]);
  return (
    <Box height="100%" width="100%" position="absolute">
      {items.map((item) => (
        <Box
          key={item.id}
          borderColor={COLOR_PRIMARY}
          borderStyle="dashed"
          borderWidth="1px"
          height={item.height}
          width={item.width}
          top={item.top}
          left={item.horizontal}
          position="relative"
          opacity="0.5"
          borderRadius="10px"
          animation={`${fadeInOut} ${Math.max(
            Math.floor(DURATION / 2),
            Math.ceil(DURATION * Math.random())
          )}s linear forwards`}
        ></Box>
      ))}
    </Box>
  );
}

export default AnimationEffect;
