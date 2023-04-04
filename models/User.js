const mongoose =require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide a name'],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        unique:true,
        required:[true, 'Please provide an email'],
        validate:{
            validator:validator.isEmail,
            message:`Please provide a valid email`
        }
    },
    password:{
        type:String,
        required:[true, 'Please provide a password'],
        minlength:6,
    },
    role:{
        type:String,
        enum:['admin', 'user'],
        default:'user',
    }
});


// encrypt password
UserSchema.pre('save', async function(){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt);
});

// compare the hashed passwords
UserSchema.methods.comparePassword=async function(candidatePassword){
    const isMatch=await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}


module.exports=mongoose.model('User', UserSchema );