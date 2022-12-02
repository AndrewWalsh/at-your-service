import { useState, useEffect } from "react";
import { AutoComplete, Grid } from "@geist-ui/core";

import { samplesToQuicktype } from "../lib";
import { Meta, QuicktypeTargetLanguageNames } from "../types";
import type { Sample } from "../data-types";
import Code from "./Code";

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

  return (
    <Grid.Container style={{ overflowX: "scroll" }}>
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

      <Code code={code} />
    </Grid.Container>
  );
}
