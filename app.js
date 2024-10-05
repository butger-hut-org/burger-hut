const http = require("http");
const jwt = require("jsonwebtoken");
const apiRouter = require("./routes/apiRoutes/apiRouter");
const webRouter = require("./routes/webRoutes/webRouter");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require('cookie-parser');


// middleware
const middleware = require("./middleware/auth");
const errorHandlerMiddleware = require("./middleware/error-handler");

//Make sure your .env file contains everything required for you application to operate properly.
require("dotenv").config();

app.use(express.json());
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Connect to mongodb database
mongoose.connect(process.env.MONGO_URI);

//Routes
app.use("/", webRouter);
app.use("/api", apiRouter);
app.get("/", (req, res) => {
  res.redirect("/login"); // Redirect root to login page
});

// Error handler middleware
app.use(errorHandlerMiddleware);
app.use(cookieParser());

const server = http.createServer(app);

const run = async () => {
  try {
    const port = process.env.PORT;
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

run();
