const User =require('../models/User');
const {generateJWT, attachCookiesToResponse}=require('../utils/jwt');


const register=async(req, res)=>{

    // check if email already exists
    const {email, name, password}=req.body;
    const emailAlreadyExists=await User.findOne({email});
    if(emailAlreadyExists){
        return res.status(400).json({msg:'Email already registered!'})
    }

    // first registered user will be an admin
    const isFirstAccount=await User.countDocuments({});
    const role=isFirstAccount===0?'admin':'user';

    const user=await User.create({email, name, password, role});
   
    // generate jwt token
    const token=generateJWT(user);

    // attach cookie to res
    attachCookiesToResponse(token, res);
   
    res.status(201).json({user});
}

const login=async(req, res)=>{
    const {email, password}=req.body;

    if(!email || !password){
        return res.status(400).json({msg:'please provide email and password'})
    }
   
    const user=await User.findOne({email});

    if(!user){
        return res.status(401).json({msg:'Invalid credentials'})
    }
    const isPasswordCorrect=await user.comparePassword(password);
    if(!isPasswordCorrect){
        return res.status(401).json({msg:'Invalid credentials'})
    }

    const token=generateJWT(user);
    attachCookiesToResponse(token, res);
    res.status(200).json({user});
}

const logout=async(req, res)=>{
    res.cookie('token', 'logout',{
        httpOnly:true,
        expires:new Date(Date.now())
    });
    res.status(200).json({msg:'user logged out!'})
}

module.exports={register, login, logout};