const express=require('express');
const router=express.Router();

// import middlewares
const {authenticateUser, authorizePermissions}=require('../middleware/authentication');

// import controllers
const {
    createProduct, getAllProducts, getSingleProduct, 
    updateProduct, uploadImage, deleteProduct } =require('../controllers/productController');

// import from reviews controller
const {getSingleProductReviews}=require('../controllers/reviewController');


router.route('/')
      .post(authenticateUser, authorizePermissions, createProduct)
      .get(getAllProducts);


router.route('/uploadImage')
      .post(authenticateUser, authorizePermissions,uploadImage)

router.route('/:id')
      .get(getSingleProduct)
      .patch(authenticateUser, authorizePermissions, updateProduct)
      .delete(authenticateUser, authorizePermissions, deleteProduct)


router.route('/:id/reviews').get(getSingleProductReviews);

module.exports=router;