/*
 * Author: Shivam Singhal
 * Description: Server Setup
 * Date: July 7, 2021
 */

const express = require("express")
const path = require("path")
var bodyParser = require("body-parser")
const morgan = require('morgan')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

require("dotenv").config({ path: "./.env" })
require("./services/bootstrap")()

const app = express()

app.use(morgan('combined'))

app.use(bodyParser.json())
app.use(bodyParser.json({ type: "application/json" }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/", require("./api"));
let port = process.env.APP_PORT// || 8080
app.listen(port, () => {
  console.log("Algo Server running at " + port)
})