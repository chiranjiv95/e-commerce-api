const Review =require('../models/Review');
const Product=require('../models/Product');
const {checkPermissions}=require('../utils/checkPermissions');

const getAllReviews=async(req, res)=>{
    const reviews=await Review.find({})
        .populate({path:'product', select:'name price company'})
        .populate({path:'user', select:'name'});
    res.status(200).json({reviews, count:reviews.length})
}

const getSingleReview=async(req, res)=>{
    const {id:reviewID}=req.params;

    const review=await Review.findOne({_id:reviewID});
    if(!review){
        return res.status(404).json({msg:'No review with the given id exists'})
    }
    res.status(200).json({review})
}

const createReview=async(req, res)=>{
    const {product:productID}=req.body;

    const product=await Product.findOne({_id:productID});
    if(!product){
        return res.status(404).json({msg:'product with the given ID does not exist'})
    }

    const alreadySubmitted=await Review.findOne({product:productID, user:req.user.userID});

    if(alreadySubmitted){
        return res.status(400).json({msg:`Review already submitted for product id:${productID} by user id:${req.user.userID}`})
    }

    req.body.user=req.user.userID;
    const review=await Review.create(req.body);
    res.status(201).json({review});
}

const updateReview=async(req, res)=>{
    const {id:reviewID}=req.params;
    const {title, rating, comment}=req.body;

    let review=await Review.findOne({_id:reviewID});
    console.log(`first - ` +review)
    if(!review){
        return res.status(404).json({msg:'No review with the given id exists'})
    }

    // check permissions
    try {
        checkPermissions(req.user, review.user)
    } catch (error) {
        return res.status(401).json({msg:'Unauthorized'});
    }

    review.title=title,
    review.comment=comment,
    review.rating=rating,
    
    await review.save();

    res.status(201).json({review})
}

const deleteReview=async(req, res)=>{
    const {id:reviewID}=req.params;

    const review=await Review.findOne({_id:reviewID});
    if(!review){
        return res.status(404).json({msg:'No review with the given id exists'})
    }
    
    // check permissions
    try {
        checkPermissions(req.user, review.user)
    } catch (error) {
        return res.status(401).json({msg:'Unauthorized'});
    }

    await review.deleteOne();
    res.status(200).json({review, status:'Deleted Successfully'})
}

// get single product reviews
const getSingleProductReviews=async(req, res)=>{
    const {id:productID}=req.params;
    const reviews=await Review.find({product:productID});
    res.status(200).json({reviews, count:reviews.length});
}

module.exports={
    getAllReviews, getSingleReview, createReview, updateReview, deleteReview, getSingleProductReviews
}
