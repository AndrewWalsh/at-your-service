import { Box, keyframes } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { uniqueId, random } from "lodash";

import { COLOR_PRIMARY, COLOR_SECONDARY } from "./constants";

const fadeInOut = keyframes`
0%,100% { opacity: 0 }
50% { opacity: 0.8 }
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

type Props = {
  position: "left" | "right";
};

function AnimationEffect({ position }: Props) {
  const [items, setItems] = useState<Array<Item>>([]);

  const calculateItems = useCallback(() => {
    const howMany = Math.floor(Math.random() * QUANTITY_TO_GEN) + 1;
    const newItems: Array<Item> = [];
    for (let i = 0; i < howMany; i++) {
      const height = Math.floor(Math.random() * 40) + 1;
      // Bias towards top items from distribution
      const topItems: Array<number> = [];
      for (let i = 0; i < 2; i++) {
        topItems.push(Math.floor(Math.random() * 90));
      }
      topItems.sort();
      const heightPx = `${Math.ceil(height)}px`;
      const offset = position === "left" ? `-` : `+`;
      newItems.push({
        id: uniqueId(),
        height: heightPx,
        width: heightPx,
        // Bias towards the top
        top: `${topItems[-1] + 1}%`,
        horizontal: `calc(${
          Math.floor(Math.random() * 100) + 1
        }% ${offset} ${Math.ceil(height)}px)`,
      });
    }
    setItems(newItems);
  }, [items]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      calculateItems();
    }, DURATION * 1000);
    return () => clearTimeout(timeout);
  }, [items]);

  useEffect(() => {
    calculateItems();
  }, []);
  return (
    <Box height="100%" width="100%" position="absolute">
      {items.map((item) => (
        <Box
          key={item.id}
          borderColor={
            [COLOR_PRIMARY, COLOR_PRIMARY, COLOR_PRIMARY, COLOR_SECONDARY][
              random(0, 3)
            ]
          }
          borderStyle={
            ["dashed", "dotted", "double", "solid", "ridge", "groove"][
              random(0, 4)
            ]
          }
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
