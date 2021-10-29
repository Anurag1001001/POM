/*
 * Author: Shivam Singhal
 * Description: Route for Algo api
 * Date: July 24, 2021
 */

const express = require("express"),
  router = express.Router()

const Ctrl = require("./match.controller")

// ****************GET Request***************************
router.get('/fresh', Ctrl.fresh)

module.exports = router