const {authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')



module.exports = app => {

    
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password){
            return res.status(400).send('informe usuario e senha')

        }


        const user = await app.db('users')
           .where({email: req.body.email})
           .first()  
        
        const adminGroup = await app.db('room AS r')
            .select('r.id')
            .leftJoin('users AS u', 'r.id_user_creator','u.id')
            .where({'u.id': user.id})
            .then(result => {value = result.map(item=>item.id)})
        
        const guestGroup = await app.db('id_room')
            .from('guest')
            .where({'id_user_guest': user.id})
            .then(novo => {result = novo.map(item =>item.id_room)})


        if (!user) return res.status(400).send('Usuario n encontrado')

        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if(!isMatch) return res.status(401).send('Não autorizado')
        
        const now = Math.floor(Date.now() / 1000)

        const payload ={
            id: user.id,
            name: user.name,
            user: user.user,
            adminGroup: value,
            guestGroup: result,
            iat: now,
            exp: now + (60 * 60 * 24 *3)
        }
            res.json({
                ...payload,
                token: jwt.encode(payload, authSecret)
            })
    }
    const validateToken = async (req, res) => {
        const userData = req.body || null
        try{
            if(userData){
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()){
                    return res.send(true)
                }
            }
        }catch(e){


        }
        res.send(false)
    }
    return{signin, validateToken}
}