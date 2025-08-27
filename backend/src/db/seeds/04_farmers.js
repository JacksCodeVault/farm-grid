// backend/src/db/seeds/04_farmers.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('farmers').del();

  // Get necessary IDs from the database to link farmers correctly
  const moloCoop = await knex('organizations').where({ name: 'Molo Farmers Cooperative Society' }).first();
  const kitaleCoop = await knex('organizations').where({ name: 'Kitale Cereal Growers (KCG)' }).first();
  
  const fieldOpJames = await knex('users').where({ email: 'james.k@farmgrid.com' }).first();
  const fieldOpEsther = await knex('users').where({ email: 'esther.n@farmgrid.com' }).first();
  
  const villageTuri = await knex('villages').where({ name: 'Turi' }).first();
  const villageEndebess = await knex('villages').where({ name: 'Endebess' }).first();

  await knex('farmers').insert([
    {
      first_name: 'Wilson',
      last_name: 'Koech',
      phone_number: '0712345678',
      cooperative_id: moloCoop.id,
      village_id: villageTuri.id,
      registered_by_user_id: fieldOpJames.id
    },
    {
      first_name: 'Beatrice',
      last_name: 'Cherono',
      phone_number: '0723456789',
      cooperative_id: moloCoop.id,
      village_id: villageTuri.id,
      registered_by_user_id: fieldOpJames.id
    },
    {
      first_name: 'Daniel',
      last_name: 'Wamalwa',
      phone_number: '0734567890',
      cooperative_id: kitaleCoop.id,
      village_id: villageEndebess.id,
      registered_by_user_id: fieldOpEsther.id
    },
    {
      first_name: 'Faith',
      last_name: 'Naliaka',
      phone_number: '0745678901',
      cooperative_id: kitaleCoop.id,
      village_id: villageEndebess.id,
      registered_by_user_id: fieldOpEsther.id
    }
  ]);
};