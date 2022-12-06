import { Box, keyframes } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { uniqueId, random } from "lodash";

import { COLOR_PRIMARY, COLOR_SECONDARY } from "./constants";

type RenderBoxProps = {
  id: string;
  height: string;
  width: string;
  top: string;
  horizontal: string;
};
const RenderBox = (props: RenderBoxProps) => {
  return (
    <Box
      key={props.id}
      borderColor={
        [COLOR_PRIMARY, COLOR_PRIMARY, COLOR_PRIMARY, COLOR_SECONDARY][
          random(0, 3)
        ]
      }
      borderStyle={
        ["dashed", "dotted", "double", "solid", "ridge", "groove"][random(0, 4)]
      }
      bg={
        random(0, 10) > 8
          ? random(0, 3) > 2
            ? COLOR_SECONDARY
            : COLOR_PRIMARY
          : "transparent"
      }
      borderWidth={random(0, 10) > 9 ? props.height : "1px"}
      height={props.height}
      width={props.width}
      top={props.top}
      left={props.horizontal}
      position="relative"
      opacity="0.5"
      boxShadow={`inset -2px -2px ${Number(props.height.slice(0, 2)) / DURATION}px gray`}
      borderRadius="10px"
      marginBottom="10px"
      animation={`${random(1, 5) > 4 ? fadeInOutFaster : fadeInOut} ${Math.max(
        Math.floor(DURATION / 2),
        Math.ceil(DURATION * Math.random())
      )}s linear forwards`}
    ></Box>
  );
};

const fadeInOut = keyframes`
0%,100% { opacity: 0 }
50% { opacity: 0.8 }
0% { scale: 0.2; translate(0, 0) }
30% { scale: 0.7;  translate(0, 7px) }
80% { translate(2px, 7px) }
100% { scale: 1; transform: translate(10px, 10px) }
`;

const fadeInOutFaster = keyframes`
0%,100% { opacity: 0 }
50% { opacity: 0.8 }
0% { scale: 0.5; translate(0, 0) }
100% { scale: 0.6; transform: translate(50px, 50px) }
`;

type Item = {
  id: string;
  height: string;
  width: string;
  top: string;
  horizontal: string;
};

// In seconds
const DURATION = 6;
const QUANTITY_TO_GEN = 40;

function AnimationEffect() {
  const [itemsFirst, setItemsFirst] = useState<Array<Item>>([]);

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
      newItems.push({
        id: uniqueId(),
        height: heightPx,
        width: heightPx,
        top: `${topItems[-1] + 1}%`,
        horizontal: `calc(${
          Math.floor(Math.random() * 100) + 1
        }% - ${Math.ceil(height * 2)}px)`,
      });
    }
    return newItems;
  }, [itemsFirst]);

  useEffect(() => {
    const timeoutOne = setTimeout(() => {
      setItemsFirst(calculateItems());
    }, DURATION * 1000);
    return () => {
      clearTimeout(timeoutOne);
    };
  }, [itemsFirst]);

  useEffect(() => {
    setItemsFirst(calculateItems());
  }, []);
  return (
    <Box height="100%" width="100%" position="absolute">
      {itemsFirst.map((item) => (
        <RenderBox
          key={item.id}
          id={item.id}
          height={item.height}
          width={item.width}
          top={item.top}
          horizontal={item.horizontal}
        />
      ))}
    </Box>
  );
}

export default AnimationEffect;
