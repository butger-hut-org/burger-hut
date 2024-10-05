const http = require("http");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const logger = require("./middleware/logger");
const apiRouter = require("./routes/apiRoutes/apiRouter");
const webRouter = require("./routes/webRoutes/webRouter");

const connectDB = require("./db/connect");

const app = express();

//Make sure your .env file contains everything required for you application to operate properly.
require("dotenv").config();

app.use(express.json());
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Connect to mongodb database
connectDB()

//Routes
app.use("/", webRouter);
app.use("/api", apiRouter);
app.get("/", (req, res) => {
  res.redirect("/login"); // Redirect root to login page
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
