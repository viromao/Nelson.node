
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_item', table =>{
        table.increments('id').primary()
        table.integer('id_user').references('id').inTable('users')
        table.integer('id_item').references('id').inTable('item')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user_item')
};