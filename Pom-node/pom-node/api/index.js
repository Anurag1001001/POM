/*
 * Author: Anurag Tripathi
 * Description: this file is root of all routes
 * Date: May 25, 2021
 */
const express = require("express");
const Router = express.Router();
Router.use("/v1/auth", require("./auth"));
Router.use("/v1/user-moods", require("./moods"));
Router.use("/v1/genre", require("./genre"));
Router.use("/v1", require("./v0"));

module.exports = Router;
