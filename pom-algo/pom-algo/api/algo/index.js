/*
 * Author: Shivam Singhal
 * Description: Route for Algo api
 * Date: July 15, 2021
 */

const express = require("express"),
  router = express.Router()

const Ctrl = require("./algo.controller")

// ****************GET Request***************************
router.get('/initiate', Ctrl.initiate)
router.get('/score', Ctrl.score)

module.exports = router