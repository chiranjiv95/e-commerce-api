const express=require('express');
const router=express.Router();

// import middlewares
const {authenticateUser, authorizePermissions}=require('../middleware/authentication');

// import controllers
const {
    createProduct, getAllProducts, getSingleProduct, 
    updateProduct, uploadImage, deleteProduct } =require('../controllers/productController');


router.route('/')
      .post(authenticateUser, authorizePermissions, createProduct)
      .get(getAllProducts);


router.route('/uploadImage')
      .post(authenticateUser, authorizePermissions,uploadImage)

router.route('/:id')
      .get(getSingleProduct)
      .patch(authenticateUser, authorizePermissions, updateProduct)
      .delete(authenticateUser, authorizePermissions, deleteProduct)


module.exports=router;