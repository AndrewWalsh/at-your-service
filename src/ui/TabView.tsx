import { useState, useEffect } from "react";
import { AutoComplete, Grid, Spacer, Text } from "@geist-ui/core";
import SyntaxHighlighter from "react-syntax-highlighter";

import { samplesToQuicktype } from "../lib";
import { Meta, QuicktypeTargetLanguageNames } from "../types";
import type { Sample } from "../data-types";

const languages = Object.values(QuicktypeTargetLanguageNames).map((lang) => ({
  label: lang,
  value: lang,
}));

const DEFAULT_LANGUAGE = QuicktypeTargetLanguageNames.TypeScript;

type Props = {
  samples: Array<Sample>;
  meta: Array<Meta>;
};

export default function TabView({ samples, meta }: Props) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    samplesToQuicktype(samples, language).then((s) => setCode(s));
  }, [language, samples]);

  if (samples.length === 0 || meta.length === 0) {
    return <p>No results</p>;
  }

  return (
    <Grid.Container>
      <Grid.Container justify="flex-end">
        <Grid>
          <AutoComplete
            type="success"
            placeholder={language}
            options={languages}
            onSelect={(lang) => setLanguage(lang as QuicktypeTargetLanguageNames)}
          />
        </Grid>
      </Grid.Container>

      {code && (
        <div style={{ width: '100%' }}>
          <SyntaxHighlighter language={language}>{code}</SyntaxHighlighter>
        </div>
      )}
    </Grid.Container>
  );
}
