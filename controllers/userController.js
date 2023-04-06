const User=require('../models/User');
const {generateJWT, attachCookiesToResponse}=require('../utils/jwt');
const {checkPermissions}=require('../utils/checkPermissions');

// GET ALL USERS
const getAllUsers=async(req, res)=>{
        const users=await User.find({role:'user'}, {password:0});
        if(!users){
           return res.status(404).json({msg:'no users find or list is empty'})
        }
        res.status(200).json({users});
}

// GET SINGLE USER
const getSingleUser=async(req, res)=>{
    const {id}=req.params;

    const user=await User.findOne({_id:id}).select('-password');
    if(!user){
        return res.status(404).json({msg:`No user with id : ${id} found!`})
    }

    //  check for permission
    checkPermissions(req.user, user._id, res); 
    res.status(200).json({user});
}

// SHOW CURRENT USER
const showCurrentUser=async(req, res)=>{
    res.status(200).json(req.user);
}

// UPDATE USER
const updateUser=async(req, res)=>{
    const {name, email}=req.body;

    if(!email || !name){
        return res.status(400).json({msg:'Please enter name and email'});
    }
    const updatedUser=await User.findOneAndUpdate({_id:req.user.userID}, {name, email}, {new:true, runValidators:true});

    // jwt token
    const token=generateJWT(updatedUser);
    // cookie
    attachCookiesToResponse(token, res);
   
    res.status(201).json({updatedUser});

}

// UPDATE USER PASSWORD
const updateUserPassword=async(req, res)=>{
    const {oldPassword, newPassword}=req.body;
    if(!oldPassword || !newPassword){
        return res.status(400).json({msg:'Please provide your old password and a new password'});
    }

    const user=await User.findOne({_id:req.user.userID});
    
    const isPasswordCorrect=await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        return res.status(401).json({msg:'Authentication Invalid'})
    }
    user.password=newPassword;

    // save the user
    await user.save();

    res.status(201).json({msg:'Password changed successfully'});
}

module.exports={getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword}