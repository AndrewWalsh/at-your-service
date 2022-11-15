import { getTargetLanguage, Options } from "quicktype-core";

export const QUICKTYPE_CONFIG: Readonly<Partial<Options>> = {
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
  rendererOptions: {
    'just-types': 'true',
    'runtime-typecheck': 'false',
  }
};
