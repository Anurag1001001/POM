/*
 * Author: Shivam Singhal
 * Description: boostratping application's connection and 3rd parties
 * Date: July 7, 2021
 */

const DB = require("./database")

const cron = require('node-cron')

const AlgoCtrl = require('../api/algo/algo.controller')

module.exports = async () => {
  global.db = await DB.getConnectDb()
  
  if (process.env.CRON) {
    cron.schedule(process.env.CRON, () => {
      console.log('Cron Triggered @ ', new Date())
      AlgoCtrl.initiate(null, null)
    })
  }
}