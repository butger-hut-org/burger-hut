const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const appRouter = require("./router");
require('dotenv').config();
const UsersRouter = require('./routes/usersRoutes');


// main
const app = express();
app.use(express.static("public"));

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies
app.set("view engine", "ejs");
app.use('/', UsersRouter); 
app.use('/api', appRouter);
app.get('/', (req, res) => {
    res.render('public/login', { title: 'Home Page' });
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