import SyntaxHighlighter from "react-syntax-highlighter";
import prism from "react-syntax-highlighter/dist/esm/styles/hljs/darcula";

import NoData from "./NoData";

type Props = {
  code: string | null;
  language?: string;
};

export default function Code({ code, language }: Props) {
  if (!code) {
    return <NoData />;
  }

  return (
    <div style={{ width: "100%", marginTop: "10px" }}>
      <SyntaxHighlighter
        language={language || "TypeScript"}
        style={prism}
        customStyle={{ width: "100%" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
