/*
 * Author: Anurag Tripathi
 * Description: this file creates schema in a database if it's not exist.
 * Date: May 26, 2021
 */

module.exports = (knex) => {
  knex.schema.hasTable("user_genres").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("user_genres", (table) => {
        table.increments("id").primary();
        table.integer("user_id");
        table.integer("vendor");
        table.json("genre_rating");
      });
    }
  });
  knex.schema.hasTable("user_moods").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("user_moods", (table) => {
        table.increments("id").primary();
        table.integer("user_id");
        table.integer("mood_id");
        table.integer("vendor");
        table.integer("type");
        table.string("vendor_type_id");
        table.json("doc");
      });
    }
  });
  knex.schema.hasTable("user_extension").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("user_extension",(table) => {
        table.integer("user_id").primary();
        table.timestamps(true,true);  
        table.float("k_rating");
        table.float("extra_version_score");
      });
    }
  })
};
