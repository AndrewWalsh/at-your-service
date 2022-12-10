import { useState } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  Box,
  Text,
} from "@chakra-ui/react";

import { COLOR_PRIMARY, COLOR_SECONDARY } from "./constants";
import { BsSpeedometer } from "react-icons/bs";

type Props = {
  value: number;
  setValue: (value: number) => void;
};

export default function LatencySlider(props: Props) {
  const sliderValue = props.value;
  const setSliderValue = props.setValue;
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Slider
      id="slider"
      defaultValue={50}
      min={1}
      max={200}
      colorScheme="blue"
      onChange={(v) => setSliderValue(v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
        <Text fontWeight="hairline" as="span">{">50ms"}</Text>
      </SliderMark>
      <SliderMark value={150} mt="1" ml="-2.5" fontSize="sm">
        <Text fontWeight="hairline" as="span">{">150ms"}</Text>
      </SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb boxSize={4} zIndex="10">
        <Box color={COLOR_SECONDARY} as={BsSpeedometer} />
      </SliderThumb>
      <Tooltip
        hasArrow
        color="white"
        placement="top"
        bg={COLOR_PRIMARY}
        isOpen={showTooltip}
        label={`Respond after at least ${sliderValue}ms`}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
}
