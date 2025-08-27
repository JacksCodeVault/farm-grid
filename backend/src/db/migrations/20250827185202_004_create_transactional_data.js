// backend/src/db/migrations/YYYYMMDDHHMMSS_004_create_transactional_data.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('produce_collections', (table) => {
      table.increments('id').primary();
      table.integer('farmer_id').unsigned().notNullable().references('id').inTable('farmers').onDelete('RESTRICT');
      table.integer('field_operator_id').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.integer('cooperative_id').unsigned().notNullable().references('id').inTable('organizations').onDelete('RESTRICT');
      table.integer('commodity_id').unsigned().notNullable().references('id').inTable('commodities').onDelete('RESTRICT');
      table.decimal('quantity', 10, 2).notNullable();
      table.timestamp('collection_date').defaultTo(knex.fn.now());
      table.enum('status', ['IN_STOCK', 'ALLOCATED_TO_DELIVERY']).defaultTo('IN_STOCK');
    })
    .createTable('orders', (table) => {
      table.increments('id').primary();
      table.integer('buyer_id').unsigned().notNullable().references('id').inTable('organizations').onDelete('RESTRICT');
      table.integer('seller_id').unsigned().notNullable().references('id').inTable('organizations').onDelete('RESTRICT');
      table.integer('commodity_id').unsigned().notNullable().references('id').inTable('commodities').onDelete('RESTRICT');
      table.decimal('requested_quantity', 10, 2).notNullable();
      table.enum('status', ['PENDING', 'PROCESSING', 'FULFILLED', 'CANCELLED']).defaultTo('PENDING');
      table.timestamp('order_date').defaultTo(knex.fn.now());
    })
    .createTable('deliveries', (table) => {
      table.increments('id').primary();
      table.integer('order_id').unsigned().notNullable().references('id').inTable('orders').onDelete('CASCADE');
      table.integer('seller_id').unsigned().notNullable().references('id').inTable('organizations').onDelete('RESTRICT');
      table.decimal('verified_quantity', 10, 2);
      table.enum('status', ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'VERIFIED', 'PAID']).defaultTo('PENDING');
      table.date('delivery_date');
      table.timestamps(true, true);
    })
    .createTable('collection_delivery_link', (table) => {
      table.increments('id').primary();
      table.integer('collection_id').unsigned().notNullable().references('id').inTable('produce_collections').onDelete('CASCADE');
      table.integer('delivery_id').unsigned().notNullable().references('id').inTable('deliveries').onDelete('CASCADE');
      table.unique(['collection_id', 'delivery_id']);
    })
    .createTable('payments', (table) => {
      table.increments('id').primary();
      table.integer('delivery_id').unsigned().notNullable().references('id').inTable('deliveries').onDelete('RESTRICT');
      table.integer('buyer_id').unsigned().notNullable().references('id').inTable('organizations').onDelete('RESTRICT');
      table.decimal('amount', 15, 2).notNullable();
      table.string('transaction_reference').unique();
      table.enum('status', ['COMPLETED', 'FAILED']).defaultTo('COMPLETED');
      table.timestamp('payment_date').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('payments')
    .dropTableIfExists('collection_delivery_link')
    .dropTableIfExists('deliveries')
    .dropTableIfExists('orders')
    .dropTableIfExists('produce_collections');
};