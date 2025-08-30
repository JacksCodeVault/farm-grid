exports.up = function(knex) {
  return knex.schema.alterTable('produce_collections', function(table) {
    table.boolean('is_paid').notNullable().defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('produce_collections', function(table) {
    table.dropColumn('is_paid');
  });
};
