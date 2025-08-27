// backend/src/db/migrations/YYYYMMDDHHMMSS_002_create_geography_tables.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('regions', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable().unique();
    })
    .createTable('districts', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.integer('region_id').unsigned().notNullable().references('id').inTable('regions').onDelete('CASCADE');
    })
    .createTable('villages', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.integer('district_id').unsigned().notNullable().references('id').inTable('districts').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('villages')
    .dropTableIfExists('districts')
    .dropTableIfExists('regions');
};