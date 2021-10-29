/*
 * Author: Shivam Singhal
 * Description: All routes
 * Date: July 10, 2021
 */
const express = require("express"),
	router = express.Router()

router.use("/random", require("./random"))
router.use("/algo", require("./algo"))
router.use("/match", require("./match"))

module.exports = router