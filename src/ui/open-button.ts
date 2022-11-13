import { el } from "redom";

const openButton = (
  position: "bottomLeft" | "bottomRight" | "topLeft" | "topRight"
) => {
  const padding = "20px";

  const bottomLeftAbsolute = (
    position: "bottomLeft" | "bottomRight" | "topLeft" | "topRight"
  ) => ({
    position: "absolute",
    bottom:
      position === "bottomLeft" || position === "bottomRight"
        ? padding
        : undefined,
    left:
      position === "bottomLeft" || position === "topLeft" ? padding : undefined,
    right:
      position === "bottomRight" || position === "topRight"
        ? padding
        : undefined,
    top:
      position === "topLeft" || position === "topRight" ? padding : undefined,
  });

  const button = el("button", "Copy OpenAPI Spec", {
    style: bottomLeftAbsolute(position),
  });

  return button;
};

export default openButton;
