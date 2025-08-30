exports.up = function(knex) {
  return knex.schema.alterTable('produce_collections', function(table) {
    table.decimal('unit_price', 10, 2).notNullable().defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('produce_collections', function(table) {
    table.dropColumn('unit_price');
  });
};
