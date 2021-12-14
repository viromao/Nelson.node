const bcrypt = require('bcrypt-nodejs')
// const passport = require('../config/passport')


module.exports = app => {

    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

const encryptPassword = password => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

    const save = async (req, res) => {
        const user = { ...req.body } 
        try{
            // id | name | lastname | email | password 

            existsOrError(user.name, "nome não informado")
            existsOrError(user.lastname, "sobrenome não informado")
            existsOrError(user.email, "Email não informado")
            existsOrError(user.password, "Senha não informada")
            
            const userFromDB = await app.db('users')
                .where({email: user.email}).first()
            if(user.id){
                notExistsOrError(userFromDB, 'Usuário ja cadastrado')
            }
            
        } catch(msg){
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(req.body.password)
        
        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else{
            app.db('users')
            .insert(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }
    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'lastname', 'email')

            .then(users=> res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req,res) =>{
        app.db('users')
        .select('id', 'name', 'lastname', 'email')
        .where({ id: req.params.id })
        .first()
        .then(user=> res.json(user))
        .catch(err => res.status(500).send(err))

    }



// get payload

    const getByMyId = (req, res) =>{
        app.db('users')
        .select('id', 'name', 'lastname', 'email',)
        .where({ id: req.user.id })

        .first()
        .then(user=> res.json(user))
        .catch(err => res.status(500).send(err))
    }




    const encryptId = id => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(id, salt)
    }

    const remove = async (req,res) =>{
        try{
            const room = await app.db('room')
                .where({id_user_creator: req.user.id})
                console.log(room)
                existsOrError(room, 'Usuario possui room')
            // implementar pra deletar todas as rooms que o usuario é dono
            // implementar pra deletar todos os convites de room
            //delete de todos as relaçoes com itens


            const rowsDeleted = await app.db('users')
                .where({id: req.user.id}).del()



            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }

    }


        
    





    return {save, get, getById, remove, getByMyId}
}