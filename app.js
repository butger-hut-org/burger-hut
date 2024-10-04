const http = require("http");
const jwt = require("jsonwebtoken");
const apiRouter = require("./routes/apiRoutes/apiRouter");
const webRouter = require("./routes/webRoutes/webRouter");
const connectDB = require("./db/connect");

const express = require("express");

//Make sure your .env file contains everything required for you application to operate properly.
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Connect to mongodb database
connectDB()

//Routes
app.use('/', webRouter);
app.use('/api', apiRouter);
app.get('/', (req, res) => {
    res.redirect('/login'); // Redirect root to login page
});

app.get('/products/mgmt', async (req, res) => {
  res.render('./productsMgmt');
})

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
