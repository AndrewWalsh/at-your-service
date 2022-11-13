import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  getTargetLanguage,
} from "quicktype-core";
import type { Sample } from "../data-types";
import { QUICKTYPE_CONFIG } from "./constants";

/**
 * Takes an array of samples and returns a string of a JSON Schema representation for them all
 * @param samples an array of Sample objects, each of which will determine the JSON Schema
 * @returns a string of a JSON Schema representation for the samples
 */
export default async function samplesToJSONSchema(
  samples: Array<Sample>
): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage(
    getTargetLanguage("JSON Schema")
  );

  await jsonInput.addSource({
    name: "schema",
    samples: samples.map(String),
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const { lines } = await quicktype({
    inputData,
    ...QUICKTYPE_CONFIG,
  });

  let schemaStr = "";
  for (const [idx, line] of lines.entries()) {
    const newLine = idx > 0 ? "\n" : "";
    schemaStr += line + newLine;
  }

  return schemaStr;
}
