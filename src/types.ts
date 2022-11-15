import type { InferType } from "yup";
import type { MergeDeep } from "type-fest";
import type { Sample } from "./data-types";
import { messagePayloadSchema } from "./schemas";
import { CPlusPlusTargetLanguage, CSharpTargetLanguage, DartTargetLanguage, ElmTargetLanguage, FlowTargetLanguage, GoTargetLanguage, HaskellTargetLanguage, JavaScriptPropTypesTargetLanguage, JavaScriptTargetLanguage, JavaTargetLanguage, JSONSchemaTargetLanguage, KotlinTargetLanguage, ObjectiveCTargetLanguage, RubyTargetLanguage, SwiftTargetLanguage, TypeScriptTargetLanguage } from "quicktype-core";

export enum MessageTypeToWorker {
  INIT_PORT = "INIT_PORT",
  HELLO = "HELLO",
}
export type PayloadToWorker = {
  type: MessageTypeToWorker;
};

export enum MessageTypeFromWorker {
  FETCH = "FETCH",
}

export interface PayloadFromWorker
  extends InferType<typeof messagePayloadSchema> {}

type MessageDataOverrides = {
  latencyMs: number;
  response: {
    status: string;
  };
};

export type MessageData = MergeDeep<PayloadFromWorker, MessageDataOverrides>;

export type FETCHFromWorker = {
  type: MessageTypeFromWorker;
  payload: PayloadFromWorker;
};

export type EventsMap = {
  [MessageTypeFromWorker.FETCH]: (data: FETCHFromWorker) => void;
};

export type QueryParamStore = {
  [queryParamName: string]: string;
};

export type Meta = {
  beforeRequestTime: number;
  afterRequestTime: number;
  latencyMs: number;
};

export interface StoreRoute {
  /** Stores information about query parameters */
  parameters: QueryParamStore;
  /** The full path name for this endpoint */
  pathName: string;
  /** Meta information about this request */
  meta: Array<Meta>;
  /** Request JSON sample data */
  reqSamples: Array<Sample>;
  /** Response JSON sample data */
  resSamples: Array<Sample>;
}

export type StoreStructure = {
  /** Example: localhost:8080, a host:port */
  [host: string]: {
    /** Example: /api/{id}/pet, a templated url path */
    [pathname: string]: {
      /** Example: GET, a http verb */
      [method: string]: {
        /** Example: 200, a status code */
        [statusCode: string]: StoreRoute;
      };
    };
  };
};

export enum QuicktypeTargetLanguageNames {
  Ruby = "Ruby",
  JavaScript = "JavaScript",
  Flow = "Flow",
  Rust = "Rust",
  Kotlin = "Kotlin",
  Dart = "Dart",
  Python = "Python",
  Csharp = "C#",
  Go = "Go",
  Cplusplus = "C++",
  Java = "Java",
  TypeScript = "TypeScript",
  Swift = "Swift",
  ObjectiveC = "Objective-C",
  Elm = "Elm",
  JSONSchema = "JSON Schema",
  Pike = "Pike",
  PropTypes = "Prop-Types",
  Haskell = "Haskell",
}

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
}
