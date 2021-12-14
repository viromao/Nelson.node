module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validation
   
   
   
    const createRoom = (req,res) => {
        // id | name | local | data | description | id_user_creator 
        const room = { ...req.body }
        if (req.params.id) room.id = req.params.id
        if(req.user.id) room.id_user_creator = req.user.id

        try{
        existsOrError(room.name, "nome não informado")
        existsOrError(room.id_user_creator, "Erro! Não foi identificado o criador da sala")

        
    
        }catch(msg){
            return res.status(400).send(msg)
        }

        if(room.id){
            app.db('room')
                .update(room)
                .where({id: room.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else{
            app.db('room')
                .insert(room)
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
        
    }
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Codigo da room n foi informado')
            const item = await app.db('item')
                .where({id_room: req.params.id})
            
            const guest = await app.db('guest')
                .where({id_room: req.params.id})
            
            existsOrError(item, 'item atrelado')
            existsOrError(guest, 'convidados atrelados')

            //  IMPLEMENTAR DELETE EM CASCATA DE ITEM E GUEST 

            const rowsDeleted = await app.db('room')
                .where({id: req.params.id}).del()
            existsOrError(rowsDeleted, 'erro ao deletar sala')
            
            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)

        }
    }

    const get = (req, res) => {
        app.db('room')
            .then(room => res.json(room))
            .catch(err => res.status(500).send(err))
    }


    const getMyRoom = (req, res) => {
        app.db('room')
            .where({id_user_creator: req.user.id}) // id_criador
            .then(room => res.json(room))
            .catch(err => res.status(400).send(err))
    }

    const getByIdRoom = (req, res) => {
        app.db('room')
        .where({id: req.params.id})
        .then(room => res.json(room))
        .catch(err => res.status(400).send(err))
    }


 



    return{createRoom, remove, get, getMyRoom, getByIdRoom}
    
}