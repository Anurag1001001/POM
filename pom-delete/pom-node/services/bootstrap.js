/*
 * Author: Anurag Tripathi
 * Description: this file contains scripts of database connection and generates apple developer token
 * Date: May 25, 2021
 */
const db = require("./database");

module.exports = () => {
  global.Bookshelf = db.getConnectDb();
};
