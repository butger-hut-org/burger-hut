const http = require("http");
const jwt = require("jsonwebtoken");
const appRouter = require("./router");
require('dotenv').config();
const UsersRouter = require('./routes/usersRoutes');

const express = require("express");
const mongoose = require("mongoose");

//Make sure your .env file contains everything required for you application to operate properly.
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Connect to mongodb database
mongoose.connect(process.env.MONGO_URI);

//Routes

app.use('/', appRouter);

app.get('/', (req, res) => {
    res.redirect('/login'); // Redirect root to login page
});


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
