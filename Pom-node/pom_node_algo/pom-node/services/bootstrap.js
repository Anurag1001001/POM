/*
 * Author: Anurag Tripathi
 * Description: this file contains scripts of database connection and generates apple developer token
 * Date: May 25, 2021
 */

const path = require("path");
const { getToken } = require("apple-music-token-node");
const db = require("./database");

module.exports = () => {
  const ValidPath = path.resolve(__dirname, "../privateKey.p8");
  global.TokenData = getToken(
    ValidPath,
    process.env.TEAMID,
    process.env.KEYID,
    4380
  );

  global.Bookshelf = db.getConnectDb();
};
