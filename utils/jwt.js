require('dotenv').config();
const jwt =require('jsonwebtoken');

// generate jwt
const generateJWT=(user)=>{
    const payload={name:user.name, userID: user._id, role:user.role};
    const token=jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
    return token;
};

// verify jwt
const isTokenValid=(token)=>jwt.verify(token, process.env.JWT_SECRET);

// attach cookies to response
const attachCookiesToResponse=(token, res)=>{
    const oneDay=(24*3600*1000);
    res.cookie('token', token,{
        httpOnly:true,
        expires:new Date(Date.now() + oneDay),
        secure:process.env.NODE_ENV==='production',
        signed:true,
    })
}

module.exports={
    generateJWT, isTokenValid, attachCookiesToResponse
};