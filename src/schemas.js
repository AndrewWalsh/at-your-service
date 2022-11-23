import { string, number, object, boolean } from "yup";
/**
 * What the service worker MUST send to the client
 * Messages that do not meet this format are ignored
 */
export const messagePayloadSchema = object({
  beforeRequestTime: number().required().positive().integer(),
  afterRequestTime: number().required().positive().integer(),
  request: object({
    body: object({
      data: object({}),
    }).nullable(),
    headers: object({}),
    referrer: string().nullable(),
    url: string().required(),
    method: string()
      .required()
      .oneOf(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  }),
  response: object({
    body: object({
      data: object({}),
    }).nullable(),
    headers: object({}),
    referrer: string().nullable(),
    url: string().required(),
    status: number().required().positive().integer(),
    statusText: string().required(),
    redirected: boolean().required(),
    type: string().required(),
  }),
});
