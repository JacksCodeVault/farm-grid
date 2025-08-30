exports.up = function(knex) {
  return knex.schema.table('orders', function(table) {
    table.boolean('is_active').notNullable().defaultTo(true);
  });
};

exports.down = function(knex) {
  return knex.schema.table('orders', function(table) {
    table.dropColumn('is_active');
  });
};
