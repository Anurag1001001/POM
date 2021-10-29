/*
 * Author: Shivam Singhal
 * Description: Database connection
 * Date: Jul 8, 2021
 */

const { Client } = require('pg')

module.exports.getConnectDb = function () {
  return new Promise((resolve, reject) => {
    let dbConf = {
      host: process.env.HOST, // || 'ec2-75-101-232-85.compute-1.amazonaws.com',
      user: process.env.DBUSERNAME, // || 'kplterywkqjoku',
      password: process.env.PASSWORD, // || '07ad5ae84bfe58d38cc8f096135d37675f215552297627c59e36a8ed8938affd',
      database: process.env.DATABASE, // || 'da0eol676aou1k',
      port: process.env.PORT, // || '5432',
      ssl: true
    }
    console.log('Client to connect:: ', JSON.stringify(dbConf))
    let client = new Client(dbConf)

    client.connect()
      .then(() => console.log('db connected'))
      .catch(err => console.error('db connection error', err.stack))

    resolve(client)
  })
}