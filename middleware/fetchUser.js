var jwt = require('jsonwebtoken');
const JWT_secrect="SahilNenwani";

const fetchUser= (req,res,next)=>{
const token= req.header('auth-token');
if(!token){
    res.status(401).send({error:"Please authenticate using a Valid token"})
}
try {
    const data =jwt.verify(token, JWT_secrect)
    req.user = data.user
    next()
        
} catch (error) {
    res.status(401).send({error:"Please authenticate using a Valid token"})
}
}

module.exports= fetchUser