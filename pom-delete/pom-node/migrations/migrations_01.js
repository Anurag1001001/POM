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
  knex.schema.hasTable("user_calc").then((exists)=>{
    if (!exists) {
      return knex.schema.createTable("user_calc",(table)=>{
        table.increments("id").primary();
        table.integer("user_id").unique().notNullable();
        table.float("rock").defaultTo(0);
        table.float("classical").defaultTo(0);
        table.float("pop").defaultTo(0);
        table.float("rap").defaultTo(0);
        table.float("electronic").defaultTo(0);
        table.float("extra_version").defaultTo(0);
        table.float('last_login').defaultTo(0)
        table.integer('liked_count').defaultTo(0)
        table.integer('disliked_count').defaultTo(0)
        table.integer('liked_me_count').defaultTo(0)
        table.integer('disliked_me_count').defaultTo(0)
        table.float('extroverted').defaultTo(0)
        table.float('introverted').defaultTo(0)
        table.float('attractiveness').defaultTo(0)
        table.integer('rock_score').defaultTo(0)
        table.integer('classical_score').defaultTo(0)
        table.integer('pop_score').defaultTo(0)
        table.integer('rap_score').defaultTo(0)
        table.integer('electronic_score').defaultTo(0)
      });
    }
  });
  knex.schema.hasTable("user_match_today").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("user_match_today",(table) => {
        table.increments("id").primary();
        table.integer("user_id");
        table.json("matches");
      });
    }
  })
};

