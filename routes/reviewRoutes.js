const express=require('express');
const router=express.Router();

// import authentication
const {authenticateUser, authorizePermissions}=require('../middleware/authentication');
// import controllers
const { getAllReviews, getSingleReview, createReview, updateReview, deleteReview}=require('../controllers/reviewController');

router.route('/').get(getAllReviews).post(authenticateUser, createReview);
router.route('/:id').get(getSingleReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview);

module.exports=router;