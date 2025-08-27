// backend/src/db/seeds/03_organizations_and_users.js
const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes users first, then organizations
  await knex('users').del();
  await knex('organizations').del();

  // Hash a common password
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // --- Step 1: Insert all organizations ---
  await knex('organizations').insert([
    { name: 'Molo Farmers Cooperative Society', org_type: 'COOPERATIVE' },
    { name: 'Thika Coffee Growers Union', org_type: 'COOPERATIVE' },
    { name: 'Kitale Cereal Growers (KCG)', org_type: 'COOPERATIVE' },
    { name: 'Kenya Grain Handlers Ltd.', org_type: 'PROCESSOR' },
    { name: 'Central Highlands Coffee Millers', org_type: 'BUYER' }
  ]);

  // --- Step 2: Query for the organizations to get their IDs ---
  const moloCoop = await knex('organizations').where({ name: 'Molo Farmers Cooperative Society' }).first();
  const thikaCoop = await knex('organizations').where({ name: 'Thika Coffee Growers Union' }).first();
  const kitaleCoop = await knex('organizations').where({ name: 'Kitale Cereal Growers (KCG)' }).first();
  const grainHandler = await knex('organizations').where({ name: 'Kenya Grain Handlers Ltd.' }).first();
  const coffeeMiller = await knex('organizations').where({ name: 'Central Highlands Coffee Millers' }).first();


  // --- Step 3: Insert users using the retrieved organization IDs ---
  await knex('users').insert([
    // Admins
    { name: 'System Admin', email: 'admin@farmgrid.com', password: hashedPassword, role: 'SYSTEM_ADMIN', phone_number: '0700000000' },
    // Cooperative Admins
    { name: 'Jane Wanjiru', email: 'jane@molocoop.com', password: hashedPassword, role: 'COOP_ADMIN', organization_id: moloCoop.id, phone_number: '0711111111' },
    { name: 'Peter Kamau', email: 'peter@thikacoffee.com', password: hashedPassword, role: 'COOP_ADMIN', organization_id: thikaCoop.id, phone_number: '0722222222' },
    // Buyer Admins
    { name: 'David Mutua', email: 'david@kenya-grain.com', password: hashedPassword, role: 'BUYER_ADMIN', organization_id: grainHandler.id, phone_number: '0733333333' },
    { name: 'Susan Akinyi', email: 'susan@highlandsmillers.com', password: hashedPassword, role: 'BUYER_ADMIN', organization_id: coffeeMiller.id, phone_number: '0744444444' },
    // Field Operators
    { name: 'James Kiprotich', email: 'james.k@farmgrid.com', password: hashedPassword, role: 'FIELD_OPERATOR', organization_id: moloCoop.id, phone_number: '0755555555' },
    { name: 'Esther Nekesa', email: 'esther.n@farmgrid.com', password: hashedPassword, role: 'FIELD_OPERATOR', organization_id: kitaleCoop.id, phone_number: '0766666666' }
  ]);
};