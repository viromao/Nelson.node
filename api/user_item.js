const { get } = require("mongoose")
const { ParameterStatusMessage } = require("pg-protocol/dist/messages")

module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validation
    
    //id | id_user | id_item 
    
    const createRelation = (req, res) =>{
        const relation = {...req.body}
        if (req.params.id) relation.id = req.params.id

        try{
            existsOrError(relation.id_user, "Usuário não encontrado")
            existsOrError(relation.id_item, "Item não encontrado")

        }catch(msg){
            return res.status(400).send(msg)
        }
        if(relation.id){
            app.db('user_item')
                .update(relation)
                .where({id: relation.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else{
            app.db('user_item')
            .insert(relation)
            .then(_=> res.status(204).send())
            .catch(err => res.status(500).send(err))
        }

    }
    const remove = async (req,res) =>{
        try{
            const rowsDeleted = await app.db('user_item')
                .where({id: req.params.id}).del()
            existsOrError(rowsDeleted, 'erro ao deletar relation')
        
            res.status(204).send()
        }catch(msg){
            res.status(400).send(msg)
        }
    }

    const listar = (req, res) =>{
        try{

            app.db('user_item AS c')
                .select('a.name AS item_name', 'b.name AS user_name')
                .leftJoin('item AS a', 'a.id', 'c.id_item')
                .leftJoin('users AS b', 'b.id', 'c.id_user')
                .leftJoin('room AS d', 'a.id_room', 'd.id' )
                .where({'d.id': req.params.id})
                .then(resultado => res.send(resultado))

            
            
        }catch(msg){
            res.status(400).send(msg)
        }


    }

    const get = (req, res) =>{

        try{

            app.db('user_item AS c')
            .select('a.name AS item_name', 'b.name AS user_name')
            .leftJoin('item AS a', 'a.id', 'c.id_item')
            .leftJoin('users AS b', 'b.id', 'c.id_user')
            .then(resultado => res.send(resultado))

            
        }catch(msg){    
            res.status(500).send(msg)

        }


       
    }


    return{remove, listar, createRelation, get}
}