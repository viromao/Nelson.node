const { ParameterStatusMessage } = require("pg-protocol/dist/messages")

module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validation
    
    
    const createItem = (req, res) =>{
        // id | name | id_room 
        const item = {...req.body}
        if (req.params.id) item.id = req.params.id

        try{
            existsOrError(item.name, "Item sem nome")
            existsOrError(item.id_room, "Sem ID sala")

        }catch(msg){
            return res.status(400).send(msg)
        }
        if(item.id){
            app.db('item')
                .update(item)
                .where({id: item.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else{
            app.db('item')
            .insert(item)
            .then(_=> res.status(204).send())
            .catch(err => res.status(500).send(err))
        }

    }
    const remove = async (req,res) =>{
        try{
            const rowsDeleted = await app.db('item')
                .where({id: req.params.id}).del()
            existsOrError(rowsDeleted, 'erro ao deletar item')
        
            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }
    }

    const getbyId = (req, res) =>{
        app.db('item')
            .select('name')
            .where({id_room: req.params.id})
            .then(item => res.json(item))
            .catch(err => res.status(400).send(err))
    }

    const get = (req,res) =>{
        app.db('item')
            .then(item => res.json(item))
            .catch(err => res.status(500).send(err))
    }

    return{remove, getbyId, createItem, get}
}