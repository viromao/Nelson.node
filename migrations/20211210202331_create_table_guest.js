exports.up = function(knex, Promise) {
  
    return knex.schema.createTable('guest', table =>{
        table.increments('id').primary()
        table.integer('id_user_guest').references('id').inTable('users')
        table.integer('id_room').references('id').inTable('room')
  
    })
  };
  

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('guest')
};