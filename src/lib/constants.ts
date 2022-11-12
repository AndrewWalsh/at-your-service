import { getTargetLanguage, Options } from "quicktype-core";

export const QUICKTYPE_CONFIG: Partial<Options> = Object.freeze({
  allPropertiesOptional: false,
  alphabetizeProperties: true,
  combineClasses: true,
  fixedTopLevels: false,
  ignoreJsonRefs: true,
  inferBooleanStrings: true,
  inferDateTimes: true,
  inferEnums: true,
  inferIntegerStrings: true,
  inferMaps: true,
  inferUuids: true,
  // Output format is JSON Schema
  lang: getTargetLanguage("JSON Schema"),
  rendererOptions: {},
});
