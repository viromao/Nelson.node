const { select } = require("../config/db")

module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validation
    const createGuest = (req,res) =>{

        const guest = {...req.body}
        if (req.params.id) guest.id = req.params.id
        if(req.user.id) guest.id_user_guest = req.user.id


        try{
            //    id | id_user_guest | id_room 
            existsOrError(guest.id_user_guest, "Erro! Verifique o usuário.")
            existsOrError(guest.id_room, "Erro! Verifique a sala")

        }catch(msg){
            return res.status(400).send(msg)
        }

        if(guest.id){
            app.db('guest')
                .update(guest)
                .where({id: guest.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else{
            app.db('guest')
            .insert(guest)
            .then(_=> res.status(204).send())
            .catch(err => res.status(500).send(err))
        }

    }

    const get = (req,res)=>{
        app.db('guest')
            .then(guest => res.json(guest))
            .catch(err => res.status(500).send(err))
    }

    // const getByIdRoom = (req,res) => {
    //     app.db('guest AS g')
    //         .select('g.id, u.name')
    //         .leftJoin('users AS u', 'g.id_user_guest', 'u.id')
    //         .where({'g.id_room': req.params.id})
    //         .then(guest => res.send.json(guest))
    //         .catch(err => res.status(500).send(err))} 
    
    // reescrever com nome de todos



    const getByIdRoom = (req, res) => {
            app.db('guest AS g')
                .select("u.name", "g.id")
                .leftJoin('users AS u', 'g.id_user_guest', 'u.id')
                .where({"g.id_room": req.params.id})
                .then(guest => res.json(guest))
            
    } /// ID DA RELAÇÃO E NOME DO CONVIDADO DE ACORDO COM A SALA







    const getRoomWhereIamGuest = (req, res) => {
        app.db('guest AS g')
            .select('r.name', 'r.local', 'r.data')
            .leftJoin('room AS r', 'r.id', 'g.id_room')
            .where({"g.id_user_guest": req.user.id})
            .then(guest => res.json(guest))
            .catch(err => res.status(500).send(err))
        
    }



    const remove = async (req, res) => {
        try{
            // verificar se o convidado tem algum item
            const rowsDeleted = await app.db('guest')
                .where({id: req.params.id}).del()
            existsOrError(rowsDeleted, 'erro ao deletar item')
        
            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }
    }

    return({createGuest, get, getByIdRoom, remove, getRoomWhereIamGuest})
}