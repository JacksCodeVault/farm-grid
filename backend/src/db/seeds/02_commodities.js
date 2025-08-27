// backend/src/db/seeds/02_commodities.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('commodities').del();
  await knex('commodities').insert([
    { name: 'Maize', standard_unit: '90kg_bag' },
    { name: 'Coffee', standard_unit: 'kg' },
    { name: 'Tea', standard_unit: 'kg' },
    { name: 'Potatoes', standard_unit: '50kg_bag' },
    { name: 'Green Beans', standard_unit: 'kg' },
    { name: 'Avocado', standard_unit: 'kg' }
  ]);
};