/**
 * Guess a good name for a dynamic part of a url
 * A part itself is only the words "api" or "user" etc above
 * @param part A given part name (e.g. "api" in /api/...)
 * @param existingParts A set of existing part names, e.g. {userId}
 * @returns A string like {userId} or {productId} or {userId1}
 */
export default function createDynamicPartName(part, existingParts) {
  const recurse = (part, existingParts, int = 0) => {
    const id = part ? "Id" : "id";
    const proposedName = `{${part}${id}${int > 0 ? int : ""}}`;
    if (existingParts.has(proposedName)) {
      return recurse(part, existingParts, int + 1);
    }
    return proposedName;
  };
  return recurse(part, existingParts);
}
