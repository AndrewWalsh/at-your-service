import server from "server";
import corsImport from "cors";

/**
 * Dummy server for testing purposes
 */

const { get } = server.router;

const corsExpress = corsImport({
  origin: "*",
});

const response = {
  data: {
    text: "text",
  },
};

const responseTwo = {
  data: {
    text: 1,
  },
};

const cors = server.utils.modern(corsExpress);

server({ port: 8080 }, cors, [
  get("/hello", (ctx) => response),
  get("/requires/:id/info", async (ctx) => {
    return Math.random() > 0.5 ? response : responseTwo;
  }),
]);
