/*
 * Author: Anurag Tripathi
 * Description: this file contains all routes with respect to user's mood and it's crud.
 * Date: May 25, 2021
 */
const express = require("express");
const Router = express.Router();

const Controller = require("./music.controller");
const Verify = require("../../services/middleware/token").verify;

Router.get("/list/", Verify, Controller.getList);
Router.post("/", Verify, Controller.create);
Router.delete("/:id", Verify, Controller.remove);

module.exports = Router;
