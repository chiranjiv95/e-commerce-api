const mongoose=require('mongoose');

const ProductShema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide product name'],
        trim:true,
        maxlength:[100, 'Name cannot be more than 100 characters']
    },
    price:{
        type:Number,
        required:[true, 'Please provide product price'],
        default:0,
    },
    description:{
        type:String,
        required:[true, 'Please provide product description'],
        maxlength:[1000, 'Description cannot be more than a 1000 characters']
    },
    image:{
        type:String,
        default:'/uploads/example.jpeg'
    },
    category:{
        type:String,
        enum:['office', 'kitchen', 'bedroom'],
        required:[true, 'Please provide product category']
    },
    company:{
        type:String,
        required:[true, 'Please provide product company'],
        enum:{
            values:['ikea','liddy','marcos'],
            message:'{VALUE} is not supported'
        }
    },
    colors:{
        type:[String],
        required:true,
        default:['#222']
    },
    featured:{
        type:Boolean,
        default:false,
    },
    freeShipping:{
        type:Boolean,
        default:false,
    },
    inventory:{
        type:Number,
        required:true,
        default:15,
    },
    averageRating:{
        type:Number,
        default:0,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },
}, {timeStamps:true});

module.exports=mongoose.model('Product', ProductShema);