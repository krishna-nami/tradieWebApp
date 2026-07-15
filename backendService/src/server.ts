import "dotenv/config";

import app from "./app.js";

const PORT = process.env.PORT || 5001;

const MODE = process.env.NODE_ENV || "developement";

const startServer = async () => {
  const server = app.listen(PORT, () => {
    console.info(`The server is runnning on http://localhost:${PORT}`);
    console.info(`Environment is ${MODE}`);
  });

  //Starts the server,
  server.on("error", (error) => {
    console.error("Server Encountered Error:", error.message);
    process.exit(1);
  });

  const gracefulShutdown = (signal: string) => {
    console.info(`${signal} recieved, sutting down Gracefully`);

    server.close(() => {
      console.info("server Closed Successfullly");
      process.exit(0);
    });
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  process.on("unhandledRejection", (error) => {
    console.error("undandled Rejections:", error);
    server.close(() => {
      process.exit(1);
    });
  });
  process.on("uncaughtException", (err) => {
    console.error("unccaught Exception", err);
    process.exit(1);
  });
};
// handles server errors.
startServer().catch((error) => {
  console.error("Failed to start server", error.message);
  process.exit(1);
});
