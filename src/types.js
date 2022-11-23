import {
  CPlusPlusTargetLanguage,
  CSharpTargetLanguage,
  DartTargetLanguage,
  ElmTargetLanguage,
  FlowTargetLanguage,
  GoTargetLanguage,
  HaskellTargetLanguage,
  JavaScriptPropTypesTargetLanguage,
  JavaScriptTargetLanguage,
  JavaTargetLanguage,
  JSONSchemaTargetLanguage,
  KotlinTargetLanguage,
  ObjectiveCTargetLanguage,
  RubyTargetLanguage,
  SwiftTargetLanguage,
  TypeScriptTargetLanguage,
} from "quicktype-core";
export var MessageTypeToWorker;
(function (MessageTypeToWorker) {
  MessageTypeToWorker["INIT_PORT"] = "INIT_PORT";
  MessageTypeToWorker["HELLO"] = "HELLO";
})(MessageTypeToWorker || (MessageTypeToWorker = {}));
export var MessageTypeFromWorker;
(function (MessageTypeFromWorker) {
  MessageTypeFromWorker["FETCH"] = "FETCH";
})(MessageTypeFromWorker || (MessageTypeFromWorker = {}));
export var QuicktypeTargetLanguageNames;
(function (QuicktypeTargetLanguageNames) {
  QuicktypeTargetLanguageNames["Ruby"] = "Ruby";
  QuicktypeTargetLanguageNames["JavaScript"] = "JavaScript";
  QuicktypeTargetLanguageNames["Flow"] = "Flow";
  QuicktypeTargetLanguageNames["Rust"] = "Rust";
  QuicktypeTargetLanguageNames["Kotlin"] = "Kotlin";
  QuicktypeTargetLanguageNames["Dart"] = "Dart";
  QuicktypeTargetLanguageNames["Python"] = "Python";
  QuicktypeTargetLanguageNames["Csharp"] = "C#";
  QuicktypeTargetLanguageNames["Go"] = "Go";
  QuicktypeTargetLanguageNames["Cplusplus"] = "C++";
  QuicktypeTargetLanguageNames["Java"] = "Java";
  QuicktypeTargetLanguageNames["TypeScript"] = "TypeScript";
  QuicktypeTargetLanguageNames["Swift"] = "Swift";
  QuicktypeTargetLanguageNames["ObjectiveC"] = "Objective-C";
  QuicktypeTargetLanguageNames["Elm"] = "Elm";
  QuicktypeTargetLanguageNames["JSONSchema"] = "JSON Schema";
  QuicktypeTargetLanguageNames["Pike"] = "Pike";
  QuicktypeTargetLanguageNames["PropTypes"] = "Prop-Types";
  QuicktypeTargetLanguageNames["Haskell"] = "Haskell";
})(QuicktypeTargetLanguageNames || (QuicktypeTargetLanguageNames = {}));
export const QuicktypeTargetLanguageEquivalent = {
  [QuicktypeTargetLanguageNames.Ruby]: RubyTargetLanguage,
  [QuicktypeTargetLanguageNames.JavaScript]: JavaScriptTargetLanguage,
  [QuicktypeTargetLanguageNames.Flow]: FlowTargetLanguage,
  [QuicktypeTargetLanguageNames.Rust]: RubyTargetLanguage,
  [QuicktypeTargetLanguageNames.Kotlin]: KotlinTargetLanguage,
  [QuicktypeTargetLanguageNames.Dart]: DartTargetLanguage,
  [QuicktypeTargetLanguageNames.Python]: "Python",
  [QuicktypeTargetLanguageNames.Csharp]: CSharpTargetLanguage,
  [QuicktypeTargetLanguageNames.Go]: GoTargetLanguage,
  [QuicktypeTargetLanguageNames.Cplusplus]: CPlusPlusTargetLanguage,
  [QuicktypeTargetLanguageNames.Java]: JavaTargetLanguage,
  [QuicktypeTargetLanguageNames.TypeScript]: TypeScriptTargetLanguage,
  [QuicktypeTargetLanguageNames.Swift]: SwiftTargetLanguage,
  [QuicktypeTargetLanguageNames.ObjectiveC]: ObjectiveCTargetLanguage,
  [QuicktypeTargetLanguageNames.Elm]: ElmTargetLanguage,
  [QuicktypeTargetLanguageNames.JSONSchema]: JSONSchemaTargetLanguage,
  [QuicktypeTargetLanguageNames.Pike]: "Pike",
  [QuicktypeTargetLanguageNames.PropTypes]: JavaScriptPropTypesTargetLanguage,
  [QuicktypeTargetLanguageNames.Haskell]: HaskellTargetLanguage,
};
