import express, { Response } from "express";
import path from "path";
import logger from "./utils/logger";
import { PORT, NODE_ENV } from "./config";
import app from "./app";
import initDb from "./db";

(async function () {
  try {
    await initDb();
    logger.info("Successfully connected to mongo");
  } catch (error) {
    logger.error(error);
  }

  if (NODE_ENV === "staging" || NODE_ENV === "beta") {
    logger.info("ENVIRONMENT IS " + NODE_ENV);
    logger.info("SERVING CLIENT");

    const APP_OUT_DIRECTORY = path.join(__dirname, "..", "..", "..", "client", "out");
    const APP_INDEX = path.join(APP_OUT_DIRECTORY, "index.html");

    app.use(express.static(APP_OUT_DIRECTORY));
    app.get("*", (_, res: Response) => {
      res.sendFile(APP_INDEX);
    });
  }

  app.listen(PORT, () => {
    logger.info("Listening on PORT: " + PORT);
  });
})();
