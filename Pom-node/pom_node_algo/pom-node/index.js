/*
 * Author: Anurag Tripathi
 * Description: script for initiating express server
 * Date: May 25, 2021
 */
const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
var bodyParser = require("body-parser");

require("dotenv").config({ path: "./.env" });
require("./services/bootstrap")();
// require('./services/test')()

const app = express();

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/json" }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// setUp view engine
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use("/", require("./api"));
app.listen(process.env.APP_PORT, () => {
  console.log("Server is up and running on port " + process.env.APP_PORT);
});
