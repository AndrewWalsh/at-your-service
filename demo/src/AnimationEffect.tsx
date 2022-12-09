import { Box, keyframes } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { uniqueId, random } from "lodash";

import {
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_WHITE,
  COLOR_TERTIARY,
} from "./constants";

// In seconds
const DURATION = 16;
// How many to generate on each iteration
const QUANTITY_TO_GEN = 40;
// The minimum number of items to generate
const MIN_QUANTITY_TO_GEN = 19;
// Affects the size of items
const DIMENSION = 35;
// Min size for each item
const MIN_DIMENSION = 15;
// Avoid division by zero
const BIAS = 1;
// Increase to make items disappear sooner
const DISAPPEAR_SOONER = 1.3;
// Speed of items
const SPEED = 40;
// Degree of variance
const SPEED_VARIANCE = 1.25;

const defaultAnimations = `
0% { scale: 0 }
10% { opacity: 0.4; scale: 0.8 }
30% { opacity: 1; scale: 0.9 }
90% { opacity: 1 }
`;

const generator = () => {
  const variance = () => Math.ceil(Math.random() * (SPEED_VARIANCE * SPEED));
  const y = SPEED + variance();
  const x = SPEED + variance() * 2;
  const effects = keyframes`
  ${defaultAnimations}
  0%,100% { opacity: 0; }
  100% { scale: 1; transform: translate(${x}px, ${y}px) }
  `;
  return effects;
};

const allNormalAnimations: Array<string> = [];

for (let i = 0; i < DURATION; i++) {
  allNormalAnimations.push(generator());
}

const fadeInOut = () => {
  return allNormalAnimations[random(0, allNormalAnimations.length - 1)];
};

type Item = {
  id: string;
  height: number;
  width: number;
  top: string;
  horizontal: string;
  bg: typeof COLOR_PRIMARY | typeof COLOR_SECONDARY;
};

const RenderBox = (props: Item) => {
  const height = `${Math.max(props.height, MIN_DIMENSION)}px`;
  const width = `${Math.max(props.width, MIN_DIMENSION)}px`;
  const bgs: Array<string> = [
    COLOR_WHITE,
    COLOR_WHITE,
    COLOR_PRIMARY,
    COLOR_SECONDARY,
    props.bg,
    props.bg,
    props.bg,
  ];

  const bg = bgs[random(0, bgs.length - 1)];

  const shadesOfGrey = ["#D3D3D3", "#A9A9A9"];

  const shadowWhenWhite = shadesOfGrey[random(0, shadesOfGrey.length - 1)];
  const shadowWhenPurple = "black";
  const shadowwhenBlue = COLOR_PRIMARY;

  let boxShadowColor = "";
  if (bg === COLOR_WHITE) boxShadowColor = shadowWhenWhite;
  if (bg === COLOR_PRIMARY) boxShadowColor = shadowWhenPurple;
  if (bg === COLOR_SECONDARY) boxShadowColor = shadowwhenBlue;

  let borderColor = "";
  if (bg === COLOR_WHITE) {
    borderColor = [COLOR_PRIMARY, COLOR_SECONDARY, COLOR_SECONDARY][
      random(0, 2)
    ];
  } else if (bg === COLOR_PRIMARY) {
    borderColor = COLOR_SECONDARY;
  } else {
    borderColor = COLOR_PRIMARY;
  }

  borderColor = [COLOR_PRIMARY, COLOR_SECONDARY, COLOR_SECONDARY][random(0, 2)];
  if (bg === borderColor) {
    borderColor = COLOR_TERTIARY;
  }

  return (
    <Box
      key={props.id}
      zIndex={Math.ceil(props.height)}
      bg={bg}
      border="1px solid rgba(0, 0, 0, 0.01)"
      height={height}
      width={width}
      top={props.top}
      left={props.horizontal}
      position="relative"
      boxShadow={`inset -2px -2px 5px ${boxShadowColor}`}
      borderRadius="10px"
      marginBottom="10px"
      animation={`${fadeInOut()} ${Math.max(
        Math.min(Math.floor(DURATION / DISAPPEAR_SOONER)),
        Math.ceil(DURATION * Math.random())
      )}s linear forwards`}
    ></Box>
  );
};

function AnimationEffect(props: {
  bg: typeof COLOR_PRIMARY | typeof COLOR_SECONDARY;
}) {
  const [itemsFirst, setItemsFirst] = useState<Array<Item>>([]);

  const calculateItems = useCallback(() => {
    const howMany =
      Math.max(
        Math.floor(Math.random() * QUANTITY_TO_GEN),
        MIN_QUANTITY_TO_GEN
      ) + BIAS;
    const newItems: Array<Item> = [];
    for (let i = 0; i < howMany; i++) {
      const height = Math.floor(Math.random() * DIMENSION) + BIAS;
      // Bias towards top items from distribution
      const topItems: Array<number> = [];
      for (let i = 0; i < 2; i++) {
        topItems.push(Math.floor(Math.random() * 90));
      }
      topItems.sort();
      newItems.push({
        id: uniqueId(),
        bg: props.bg,
        height: height,
        width: height,
        top: `${topItems[-1] + BIAS}%`,
        horizontal: `calc(${
          Math.floor(Math.random() * 100) - 10
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
          bg={item.bg}
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
