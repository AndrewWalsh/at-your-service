import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AutoComplete, Grid } from "@geist-ui/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import { samplesToQuicktype } from "../lib";
import { QuicktypeTargetLanguageNames } from "../types";
const languages = Object.values(QuicktypeTargetLanguageNames).map((lang) => ({
  label: lang,
  value: lang,
}));
const DEFAULT_LANGUAGE = QuicktypeTargetLanguageNames.TypeScript;
export default function TabView({ samples, meta }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [code, setCode] = useState(null);
  useEffect(() => {
    samplesToQuicktype(samples, language).then((s) => setCode(s));
  }, [language, samples]);
  if (samples.length === 0 || meta.length === 0) {
    return _jsx("p", { children: "No results" });
  }
  return _jsxs(Grid.Container, {
    children: [
      _jsx(
        Grid.Container,
        Object.assign(
          { justify: "flex-end" },
          {
            children: _jsx(Grid, {
              children: _jsx(AutoComplete, {
                type: "success",
                placeholder: language,
                options: languages,
                onSelect: (lang) => setLanguage(lang),
              }),
            }),
          }
        )
      ),
      code &&
        _jsx(
          "div",
          Object.assign(
            { style: { width: "100%" } },
            {
              children: _jsx(
                SyntaxHighlighter,
                Object.assign({ language: language }, { children: code })
              ),
            }
          )
        ),
    ],
  });
}
