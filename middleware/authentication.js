const {isTokenValid}=require('../utils/jwt');

const authenticateUser=async(req, res, next)=>{
    const token=req.signedCookies.token;
    if(!token){
        return res.status(401).json({msg:'Authentication Invalid'})
    }

    try {
        const {name, userID, role}=isTokenValid(token);
        req.user={name, userID, role};
        next();
    } catch (error) {
        console.log('inside catch')
        res.status(401).json({msg:'Authentication Invalid'})
    }
}

const authorizePermissions=(req, res, next)=>{
    const {role}=req.user;
    if(role!=='admin'){
        return res.status(403).json({msg:'Unauthorized!'})
    }
    next();
}

module.exports={authenticateUser, authorizePermissions};