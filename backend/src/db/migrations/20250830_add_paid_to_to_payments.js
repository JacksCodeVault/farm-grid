exports.up = function(knex) {
  return knex.schema.alterTable('payments', function(table) {
    table.integer('paid_to').unsigned().notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('payments', function(table) {
    table.dropColumn('paid_to');
  });
};
