/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    table.string('password_reset_token', 255).nullable();
    table.datetime('password_reset_expires').nullable();
    table.string('otp_secret', 255).nullable(); // For OTP generation
    table.string('passwordless_login_token', 255).nullable();
    table.datetime('passwordless_login_expires').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('password_reset_token');
    table.dropColumn('password_reset_expires');
    table.dropColumn('otp_secret');
    table.dropColumn('passwordless_login_token');
    table.dropColumn('passwordless_login_expires');
  });
};
