exports.up = function(knex) {
  return knex.schema.alterTable('payments', function(table) {
    table.string('paid_by').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('payments', function(table) {
    table.dropColumn('paid_by');
  });
};
