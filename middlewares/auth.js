import jwt from "jsonwebtoken";

const jwtsecret = process.env.JWT_SECRET;

const auth = function (req, res, next)
{
    const token = req.headers.authorization;
    if(!token)
        res.status(404).json({message:"Acesso negado"});
    else
    {
        try
        {
            const decode = jwt.verify(token.replace("Bearer ", ""), jwtsecret);
            req.user = decode.id;
            next();
        }
        catch(error)
        {
            res.status(401).json({message:"Token invalido!"});
        }
    }
    
}

export default auth;