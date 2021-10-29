/*
 * Author: Anurag Tripathi
 * Description: this file contains all routes for genres api
 * Date: May 26, 2021
 */
const express = require("express");
const Router = express.Router();

const Controller = require("./genre.controller");
const Verify = require("../../services/middleware/token").verify;

Router.get("/", Verify, Controller.read);
Router.post("/", Verify, Controller.create);

module.exports = Router;
