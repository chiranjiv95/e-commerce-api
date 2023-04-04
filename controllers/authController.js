const User =require('../models/User');

const register=async(req, res)=>{

    // check for email already exists
    const {email, name, password}=req.body;
    const emailAlreadyExists=await User.findOne({email});
    if(emailAlreadyExists){
        return res.status(400).json({msg:'Email already registered!'})
    }

    // first registered user is an admin
    const isFirstAccount=await User.countDocuments({});
    const role=isFirstAccount===0?'admin':'user';

    const user=await User.create({email, name, password, role});
    res.status(201).json({user});
}

const login=async(req, res)=>{
    res.send(`login`)
}

const logout=async(req, res)=>{
    res.send(`logout`)
}

module.exports={register, login, logout};