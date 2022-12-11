class FetchPayload {
  /**
   * Used as the message payload to the client
   * @param {Event} event - a fetch event
   * @param {Response} response - a response object from a fetch event
   * @param {number} beforeRequestTime - a timestamp from before the request was made
   * @param {number} afterRequestTime - a timestamp from when a response was received
   * @param {string} requestBody - the request body serialized as a JSON string
   */
  constructor(event, response, beforeRequestTime, afterRequestTime, requestBody) {
    // HACK: to work with the demo
    const clonedRes = { ...response, headers: Object.entries(response.headers) }

    const outerThis = this;
    this.payload = new Promise((resolve) => {
      outerThis._resolve = (payload) => {
        resolve(payload);
        return payload;
      };
    });

    this._createPayload(
      event,
      clonedRes,
      beforeRequestTime,
      afterRequestTime,
      requestBody,
    );
  }

  getPayload() {
    return this.payload;
  }

  /**
   * Creates a payload asynchronously
   * @param {Event} event
   * @param {Response} response
   * @param {number} beforeRequestTime
   * @param {number} afterRequestTime
   * @param {string} requestBody
   */
  async _createPayload(event, response, beforeRequestTime, afterRequestTime, requestBody) {
    const request = event.request
    const requestHeaders = {};
    for (const [key, value] of request.headers) {
      requestHeaders[key] = value;
    }

    const responseHeaders = {};
    for (const [key, value] of response.headers) {
      responseHeaders[key] = value;
    }

    let responseBody;
    try {
      const decoder = new TextDecoder("utf-8")
      const decoded = decoder.decode(response.body)
      responseBody = JSON.parse(decoded)
    } catch {
      responseBody = null;
    }

    this._resolve({
      beforeRequestTime,
      afterRequestTime,
      request: {
        body: requestBody ? JSON.parse(requestBody) : null,
        referrer: request.referrer || null,
        url: request.url,
        headers: requestHeaders,
        method: request.method,
      },
      response: {
        body: responseBody,
        referrer: response.referrer || null,
        url: response.url || request.url,
        headers: responseHeaders,
        status: response.status,
        type: "basic",
      },
    });
  }
}

/**
 *
 * @param {Event} event
 * @param {string} type
 * @param {FetchPayload} payload
 */
async function postMessageToAYS(event, type, payload) {
  const thisClient = await self.clients.get(event.clientId);
  if (thisClient) {
    thisClient.postMessage({ type, payload });
    thisClient
  }
}
