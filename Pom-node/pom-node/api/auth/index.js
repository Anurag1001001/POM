/*
 * Author: Anurag Tripathi
 * Description: this file contains all authentication routes
 * Date: May 25, 2021
 */

const express = require("express");
const Router = express.Router();

const AppleController = require("./apple.controller");
const UserController = require("./user.controller");
const Verify = require("../../services/middleware/token").verify;

Router.get("/apple_login", AppleController.login);
Router.get("/apple_login/token", AppleController.accessToken);
Router.get("/token", Verify, UserController.validate);

module.exports = Router;
