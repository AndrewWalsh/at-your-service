import isUUID from "validator/es/lib/isUUID";
import createDynamicPartName from "./create-dynamic-part-name";

/**
 * We want to turn pathnames:
 *
 *    from    /api/user/ec6b0caa-ee57-41b9-9810-c996c34f260a/post/new
 *
 *    into    /api/user/{userId}/post/new
 *
 * This is a very simple approach towards that based on heuristics
 * So far, that we use the previous part in the pathname
 *
 * @param pathname A pathname like /api/user/ec6b0caa-ee57-41b9-9810-c996c34f260a/post/new
 * @returns A pathname like /api/user/{userId}/post/new
 */
export default function withNamedPathParts(pathname: string): string {
  const split = pathname.split("/");
  const existingPartReplacements = new Set<string>();
  let lastPart = "";
  const parsed = split.map((part) => {
    // This is a very simple approach
    // Turn UUIDS into {id}
    if (isUUID(part)) {
      let suggestedPartName = "";
      if (lastPart) {
        suggestedPartName = lastPart;
      }
      const partName = createDynamicPartName(
        suggestedPartName,
        existingPartReplacements
      );
      existingPartReplacements.add(partName);
      return partName;
    }
    lastPart = part;
    return part;
  });
  return parsed.join("/");
}
