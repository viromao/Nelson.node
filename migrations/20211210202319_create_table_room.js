exports.up = function(knex, Promise) {
    return knex.schema.createTable('room', table =>{
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('local')
        table.string('data')
        table.string('description')
        table.integer('id_user_creator').references('id').inTable('users')
  
    })
  };
  
  exports.down = function(knex, Promise) {
      return knex.schema.dropTable('room')
    
  };