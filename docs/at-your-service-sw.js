// self.addEventListener("install", function () {
//   self.skipWaiting();
// });

// self.addEventListener("activate", function (event) {
//   event.waitUntil(self.clients.claim());
// });

// self.addEventListener("message", async (event) => {
//   const clientId = event.source.id;

//   if (!clientId || !self.clients) {
//     return;
//   }

//   const client = await self.clients.get(clientId);

//   if (!client) {
//     return;
//   }

//   if (!event.data) {
//     return;
//   }

//   switch (event.data.type) {
//     case "HELLO": {
//       postMessage(event, "HELLO", "WORLD");
//     }
//     case "INIT_PORT": {
//       postMessage(event, "INIT_PORT", "WORLD");
//     }
//   }
// });

// self.addEventListener("fetch", function (event) {
//   const { request } = event;
//   const accept = request.headers.get("accept") || "";

//   // Ignore server events
//   if (accept.includes("text/event-stream")) {
//     return;
//   }

//   // Ignore scripts, images, etc
//   if (
//     new Set(["script", "worker", "stylesheet", "image"]).has(
//       request.destination
//     )
//   ) {
//     return;
//   }

//   // Ignore client-side navigation requests
//   if (request.mode === "navigate") {
//     return;
//   }

//   // Opening the DevTools triggers the "only-if-cached" request
//   // that cannot be handled by the worker. Bypass such requests.
//   if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
//     return;
//   }

//   // https://github.com/iamshaunjp/pwa-tutorial/issues/1
//   if (!(event.request.url.indexOf("http") === 0)) return;

//   const beforeRequestTime = Date.now();
//   event.respondWith(
//     fetch(event.request).then(async (response) => {
//       const afterRequestTime = Date.now();
//       const payload = await new FetchPayload(
//         request,
//         response,
//         beforeRequestTime,
//         afterRequestTime
//       ).getPayload();
//       postMessage(event, "FETCH", payload);
//       return response;
//     })
//   );
// });

// https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
  c = array[i++];
  switch(c >> 4)
  { 
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
      // 0xxxxxxx
      out += String.fromCharCode(c);
      break;
    case 12: case 13:
      // 110x xxxx   10xx xxxx
      char2 = array[i++];
      out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
      break;
    case 14:
      // 1110 xxxx  10xx xxxx  10xx xxxx
      char2 = array[i++];
      char3 = array[i++];
      out += String.fromCharCode(((c & 0x0F) << 12) |
                     ((char2 & 0x3F) << 6) |
                     ((char3 & 0x3F) << 0));
      break;
  }
  }

  return out;
}

class FetchPayload {
  /**
   * Used as the message payload to the client
   * @param {Request} request - a request object from a fetch event
   * @param {Response} response - a response object from a fetch event
   * @param {number} beforeRequestTime - a timestamp from before the request was made
   * @param {number} afterRequestTime - a timestamp from when a response was received
   */
  constructor(request, response, beforeRequestTime, afterRequestTime) {
    const clonedReq = request.clone();
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
      clonedReq,
      clonedRes,
      beforeRequestTime,
      afterRequestTime
    );
  }

  getPayload() {
    return this.payload;
  }

  /**
   * Creates a payload asynchronously
   * @param {Request} request
   * @param {Response} response
   * @param {number} beforeRequestTime
   * @param {number} afterRequestTime
   */
  async _createPayload(request, response, beforeRequestTime, afterRequestTime) {
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
        body: request.body || null,
        referrer: request.referrer || null,
        url: request.url,
        headers: requestHeaders,
        method: request.method,
      },
      response: {
        body: responseBody,
        referrer: response.referrer || null,
        url: request.url,
        headers: responseHeaders,
        status: response.status,
        statusText: response.statusText,
        redirected: false,
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
