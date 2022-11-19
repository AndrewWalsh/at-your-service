import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} from "quicktype-core";

import type { Sample } from "../data-types";
import { QUICKTYPE_CONFIG } from "./constants";
import { QuicktypeTargetLanguageNames } from "../types";

/**
 * Takes an array of samples and returns a string of a JSON Schema representation for them all
 * @param samples an array of Sample objects, each of which will determine the JSON Schema
 * @returns a string of a JSON Schema representation for the samples
 */
export default async function samplesToQuicktype(
  samples: Array<Sample>,
  lang: QuicktypeTargetLanguageNames = QuicktypeTargetLanguageNames.JSONSchema
): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage(lang);

  await jsonInput.addSource({
    name: "body",
    samples: samples.map(String),
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const { lines } = await quicktype({
    inputData,
    lang,
    ...QUICKTYPE_CONFIG,
  });

  return lines.join("\n");
}
