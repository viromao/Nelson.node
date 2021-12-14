const adminGroup = require('./room_admin')
const guest = require('./guest.js')

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(app.api.user.save)
        .get(app.api.user.getByMyId)
        .delete(app.api.user.remove)
 
app.route('/users/:id')
    .all(app.config.passport.authenticate())
    .put(app.api.user.save)
    

app.route('/room')
    .all(app.config.passport.authenticate())
    .get(app.api.room.getMyRoom)   // PARA LISTAR TODAS AS SALAS DO USER, LEMBRAR DE CONCATENAR COM GUEST
    .post(app.api.room.createRoom)

app.route('/room/:id')
    .all(app.config.passport.authenticate())
    .get(guest(app.api.room.getByIdRoom))
    .put(adminGroup(app.api.room.createRoom))
    .delete(adminGroup(app.api.room.remove))   





app.route('/item')
    .all(app.config.passport.authenticate())
    .get(guest(app.api.item.get))
    .post(adminGroup(app.api.item.createItem))

app.route('/item/:id')
    .all(app.config.passport.authenticate())
    .get(guest(app.api.item.getbyId)) //idroom
    .post(adminGroup(app.api.item.createItem))
    .delete(adminGroup(app.api.item.remove))


app.route('/guest')
    .all(app.config.passport.authenticate())
    .get(app.api.guest.getRoomWhereIamGuest)
    .post(adminGroup(app.api.guest.createGuest))

app.route('/guest/:id')
.all(app.config.passport.authenticate())
    .get(guest(app.api.guest.getByIdRoom)) //precisa ser admin do grupo, mas tem q ver
    .post(adminGroup(app.api.guest.createGuest))
    .delete(adminGroup(app.api.guest.remove))  

app.route('/room/relacao')
    .all(app.config.passport.authenticate())
    .get(app.api.user_item.get)
    .post(app.api.user_item.createRelation)   

app.route('/room/relacao/:id')
    .all(app.config.passport.authenticate())
    .get(app.api.user_item.listar)

}