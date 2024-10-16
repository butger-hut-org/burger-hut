const http = require("http");
const express = require("express");
const logger = require("./middleware/logger");
const apiRouter = require("./routes/apiRoutes/apiRouter");
const webRouter = require("./routes/webRoutes/webRouter");
const errorHandlerMiddleware = require("./middleware/error-handler");
const cookieParser = require('cookie-parser');

//Make sure your .env file contains everything required for you application to operate properly.
require("dotenv").config();

const app = express();
const connectDB = require("./db/connect");

// Error handler middleware
app.use(errorHandlerMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Connect to mongodb database
connectDB()

//Routes
app.use("/", webRouter);
app.use("/api", apiRouter);
app.get("/", (_, res) => {
  res.redirect("/login"); // Redirect root to login page
});
app.use((_, res) => {
  const header = "Oops!";
  const message = "This page doesn't exist...";
  res.render("../views/includes/error", { header, message });
});

const server = http.createServer(app);

const run = async () => {
  try {
    const port = process.env.PORT;
    server.listen(port, () =>
      logger.info(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    logger.error(error);
  }
};

run();
