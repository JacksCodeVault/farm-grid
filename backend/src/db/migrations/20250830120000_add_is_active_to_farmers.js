exports.up = function(knex) {
  return knex.schema.table('farmers', function(table) {
    table.boolean('is_active').notNullable().defaultTo(true);
  });
};

exports.down = function(knex) {
  return knex.schema.table('farmers', function(table) {
    table.dropColumn('is_active');
  });
};
