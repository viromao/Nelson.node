module.exports = middleware => {
    return (req, res, next) =>{
        const found = req.user.adminGroup.find(element => element == req.params.id)
        if(found){
            middleware(req,res,next)
            
        } else{
            res.status(401).send('usuário n é admin')
        }
    }
    }
