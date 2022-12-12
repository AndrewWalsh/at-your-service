import SyntaxHighlighter from "react-syntax-highlighter";
import prism from "react-syntax-highlighter/dist/esm/styles/hljs/darcula";
import { Button } from "@geist-ui/core";

import NoData from "./NoData";

type Props = {
  code: string | null;
  language?: string;
};

export default function Code({ code, language }: Props) {
  if (!code) {
    return <NoData />;
  }

  const onClick = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div style={{ width: "100%", marginTop: "10px", position: "relative" }}>
      <Button
        style={{ position: "absolute", right: "10px", top: "10px" }}
        onClick={onClick}
      >
        Copy to clipboard
      </Button>
      <SyntaxHighlighter
        language={language || "TypeScript"}
        style={prism}
        customStyle={{ width: "100%" }}
        co
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
