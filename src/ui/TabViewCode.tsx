import { useState, useEffect } from "react";
import { AutoComplete, Grid, Text } from "@geist-ui/core";
import SyntaxHighlighter from "react-syntax-highlighter";

import { samplesToQuicktype } from "../lib";
import { Meta, QuicktypeTargetLanguageNames } from "../types";
import type { Sample } from "../data-types";

const validLanguages = Object.values(QuicktypeTargetLanguageNames).filter(
  (n) => {
    return n !== "JavaScript";
  }
);

validLanguages.sort();

const languages = validLanguages.map((lang) => ({
  label: lang,
  value: lang,
}));

const DEFAULT_LANGUAGE = QuicktypeTargetLanguageNames.TypeScript;

type Props = {
  samples: Array<Sample>;
  meta: Array<Meta>;
};

export default function TabViewCode({ samples, meta }: Props) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    samplesToQuicktype(samples, language).then((s) => setCode(s));
  }, [language, samples]);

  if (!code) {
    return (
      <Grid.Container
        justify="center"
        gap={1}
        alignItems="center"
        height="250px"
      >
        <Grid>
          <Text>No data to show</Text>
        </Grid>
      </Grid.Container>
    );
  }

  return (
    <Grid.Container>
      <Grid.Container justify="flex-start" gap={1}>
        <Grid>
          <AutoComplete
            type="success"
            placeholder={language}
            options={languages}
            onSelect={(lang) =>
              setLanguage(lang as QuicktypeTargetLanguageNames)
            }
          />
        </Grid>
      </Grid.Container>

      {code && (
        <div style={{ width: "100%", marginTop: "10px" }}>
          <SyntaxHighlighter language={language}>{code}</SyntaxHighlighter>
        </div>
      )}
    </Grid.Container>
  );
}
