// migration for sms_logs table
exports.up = function(knex) {
  return knex.schema.createTable('sms_logs', function(table) {
    table.increments('id').primary();
    table.string('phone_number', 20).notNullable().index('idx_phone_number');
    table.text('message').notNullable();
    table.string('command', 50).index('idx_command');
    table.enu('status', ['SUCCESS', 'FAILED']).notNullable();
    table.text('response');
    table.json('webhook_data');
    table.timestamp('processed_at').defaultTo(knex.fn.now()).index('idx_processed_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sms_logs');
};
