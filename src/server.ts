process.on("uncaughtException", (error) => {
  console.error(
    "❌ `Uncaught exception` happened, exiting the process and  closing the server.",
    error
  );
  process.exit(1);
});

import { Server } from "http";
import mongoose from "mongoose";
import app from "./index";
import config from "./config/config";

let server: Server;

const main = async () => {
  try {
    await mongoose.connect(config.DBUrl as string);
    console.log(`✅ Database is connected successfully.`);
    server = app.listen(config.port, () => {
      console.log(
        `✅ The server is running on http://localhost:${config.port}`
      );
    });

  } catch (error) {
    console.error(`❌ Can't connect to Database.`, error);
  }

  process.on("unhandledRejection", (error) => {
    console.error(
      `❌ Unhandled rejection happened. Exiting the process.`,
      error
    );
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    }
    process.exit(1);
  });
};

main();
