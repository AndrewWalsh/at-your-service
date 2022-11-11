import alterSchema from "alterschema";
import { SchemaObject } from "openapi3-ts";
import { omit } from "lodash";

/**
 * Convert a JSON Schema draft 4 into an OpenAPI 3.1 Schema Object
 *
 * @param jsonSchema a draft 4 JSON Schema string
 * @returns
 */
export default async function JSONSchemaToOpenAPISchema(
  jsonSchema: string
): Promise<SchemaObject> {
  jsonSchema = JSON.parse(jsonSchema);
  const sixToSeven = await alterSchema(jsonSchema, "draft6", "draft7");
  const sevenTo2019 = await alterSchema(sixToSeven, "draft7", "2019-09");
  const from2019to2020 = await alterSchema(sevenTo2019, "2019-09", "2020-12");
  const convertedToOAISpec: SchemaObject = omit(from2019to2020, ["$schema"]);
  return convertedToOAISpec;
}
