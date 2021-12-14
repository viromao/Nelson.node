module.exports = middleware => {
    return (req, res, next) =>{
        const found = req.user.guestRoom.find(element => element == req.params.id)
        const foundA = req.user.adminGroup.find(element => element == req.params.id)

        if(found || foundA){
            middleware(req,res,next)
            
        } else{
            res.status(401).send('usuário não foi convidado')
        }
    }
    }
