type ReturnPathStoreRoute = [string, string, string, string];

export default function getPathToStoreRoute(
  path: string
): ReturnPathStoreRoute {
  const splitPath = path.split("/");
  // This magic is based on how the pathToStoreRoute is saved to storage
  // Keys look something like localhost:8080/requires/{requiresId}/info/GET/200
  // {host}/{path}/{method}/{statusCode}
  const host = splitPath[0];
  const fullPath = splitPath.slice(1, -2).join("/");
  const method = splitPath[splitPath.length - 2];
  const status = splitPath[splitPath.length - 1];
  return [host, fullPath, method, status];
}
