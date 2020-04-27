
exports.up = function(knex) {
  return knex.schema.createTable("contacts", function(table) {
      table.increments();
      table.string("contact_img").notNullable();
      table.string("name").notNullable();
      table.string("phone_number").notNullable();
      table.string("email").notNullable();

      table.string("user_id");
      table.foreign("user_id").references("id").inTable("users");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("contacts");
};
