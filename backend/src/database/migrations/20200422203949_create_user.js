
exports.up = function(knex) {
  return knex.schema.createTable("users", function(table) {
      table.string("id").primary().notNullable();
      table.string("user_img").notNullable();
      table.string("name").notNullable();
      table.string("phone_number").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("password_reset_token").defaultTo(undefined);
      table.date("password_reset_expires").defaultTo(undefined);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
