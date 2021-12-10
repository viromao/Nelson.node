
exports.up = function(knex, Promise) {
    return knex.schema.createTable('msg', table =>{
        table.increments('id').primary()
        table.integer('id_user').references('id').inTable('room')
        table.integer('id_room').references('id').inTable('room')
        table.string('Mensagem').notNull()
    })

    
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('item')

  
};