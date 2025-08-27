// backend/src/db/migrations/YYYYMMDDHHMMSS_003_create_core_agricultural_data.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('commodities', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable().unique();
      table.string('standard_unit', 20).notNullable().defaultTo('kg');
    })
    .createTable('farmers', (table) => {
      table.increments('id').primary();
      table.string('first_name', 100).notNullable();
      table.string('last_name', 100).notNullable();
      table.string('phone_number', 20).notNullable().unique();
      table.integer('cooperative_id').unsigned().notNullable().references('id').inTable('organizations').onDelete('RESTRICT');
      table.integer('village_id').unsigned().notNullable().references('id').inTable('villages').onDelete('RESTRICT');
      table.integer('registered_by_user_id').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('farmers')
    .dropTableIfExists('commodities');
};