
exports.up = function(knex, Promise) {
    return knex.schema.createTable('item', table =>{
        table.increments('id').primary()
        table.string('name', 5000).notNull()
        table.integer('id_room').references('id').inTable('room')
    })

    
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('item')

  
};