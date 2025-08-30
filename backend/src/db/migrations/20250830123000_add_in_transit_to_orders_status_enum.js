exports.up = function(knex) {
  return knex.schema.raw(`ALTER TABLE orders MODIFY COLUMN status ENUM('PENDING','PROCESSING','FULFILLED','CANCELLED','IN_TRANSIT') DEFAULT 'PENDING'`);
};

exports.down = function(knex) {
  return knex.schema.raw(`ALTER TABLE orders MODIFY COLUMN status ENUM('PENDING','PROCESSING','FULFILLED','CANCELLED') DEFAULT 'PENDING'`);
};
