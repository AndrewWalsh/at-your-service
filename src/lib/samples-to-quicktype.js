var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} from "quicktype-core";
import { QUICKTYPE_CONFIG } from "./constants";
import { QuicktypeTargetLanguageNames } from "../types";
/**
 * Takes an array of samples and returns a string of a JSON Schema representation for them all
 * @param samples an array of Sample objects, each of which will determine the JSON Schema
 * @returns a string of a JSON Schema representation for the samples
 */
export default function samplesToQuicktype(
  samples,
  lang = QuicktypeTargetLanguageNames.JSONSchema
) {
  return __awaiter(this, void 0, void 0, function* () {
    const jsonInput = jsonInputForTargetLanguage(lang);
    yield jsonInput.addSource({
      name: "body",
      samples: samples.map(String),
    });
    const inputData = new InputData();
    inputData.addInput(jsonInput);
    const { lines } = yield quicktype(
      Object.assign({ inputData, lang }, QUICKTYPE_CONFIG)
    );
    return lines.join("\n");
  });
}
