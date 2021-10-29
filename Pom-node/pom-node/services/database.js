/*
 * Author: Anurag Tripathi
 * Description: scripts for database connection
 * Date: May 25, 2021
 */
const Createtable = require("../migrations/migrations_01");

module.exports.getConnectDb = function () {
  const knex = require("knex")({
    client: "pg",
    connection: {
      host: process.env.HOST,
      user: process.env.DBUSERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      charset: "utf8",
      port: process.env.PORT,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
  Createtable(knex);
  const bookshelf = require("bookshelf")(knex);
  return bookshelf;
};
