/*
 * Author: Deepak Tuli
 * Description: Health Check API
 * Date: July 20, 2021
 */
const express = require("express");
const Router = express.Router();

const Controller = require("./random.controller.js");

Router.get("/health-check", Controller.healthCheck);

module.exports = Router;
