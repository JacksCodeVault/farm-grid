// backend/src/db/seeds/01_geography.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries in reverse order of creation
  await knex('villages').del();
  await knex('districts').del();
  await knex('regions').del();

  // --- Step 1: Insert all parent rows (regions) first ---
  await knex('regions').insert([
    { name: 'Nakuru County' },
    { name: 'Kiambu County' },
    { name: 'Trans Nzoia County' }
  ]);

  // --- Step 2: Query for the parents to get their IDs ---
  const nakuru = await knex('regions').where('name', 'Nakuru County').first();
  const kiambu = await knex('regions').where('name', 'Kiambu County').first();
  const transNzoia = await knex('regions').where('name', 'Trans Nzoia County').first();

  // --- Step 3: Insert districts using the retrieved region IDs ---
  await knex('districts').insert([
    { name: 'Molo', region_id: nakuru.id },
    { name: 'Thika', region_id: kiambu.id },
    { name: 'Kitale', region_id: transNzoia.id }
  ]);

  // --- Step 4: Query for the districts to get their IDs ---
  const molo = await knex('districts').where('name', 'Molo').first();
  const thika = await knex('districts').where('name', 'Thika').first();
  const kitale = await knex('districts').where('name', 'Kitale').first();

  // --- Step 5: Insert villages using the retrieved district IDs ---
  await knex('villages').insert([
    { name: 'Keringet', district_id: molo.id },
    { name: 'Turi', district_id: molo.id },
    { name: 'Gatuanyaga', district_id: thika.id },
    { name: 'Makongeni', district_id: thika.id },
    { name: 'Kapsokwony', district_id: kitale.id },
    { name: 'Endebess', district_id: kitale.id }
  ]);
};