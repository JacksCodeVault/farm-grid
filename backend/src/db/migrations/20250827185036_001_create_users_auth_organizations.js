/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('organizations', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.enum('org_type', ['COOPERATIVE', 'PROCESSOR', 'BUYER', 'EXPORTER']).notNullable();
      table.text('location_details');
      table.timestamps(true, true);
    })
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable(); // Will store hashed password
      table.string('phone_number', 20).unique();
      table.enum('role', ['SYSTEM_ADMIN', 'BOARD_MEMBER', 'COOP_ADMIN', 'BUYER_ADMIN', 'FIELD_OPERATOR']).notNullable();
      table.integer('organization_id').unsigned().references('id').inTable('organizations').onDelete('SET NULL');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('organizations');
};