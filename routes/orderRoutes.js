const express=require('express');
const router=express.Router();

const {authenticateUser, authorizePermissions}=require('../middleware/authentication');

const {
    getAllOrders, getSingleOrder, getCurrentUserOrders, updateOrder, deleteOrder, createOrder
}=require('../controllers/orderController');


router.route('/').get(authenticateUser, authorizePermissions, getAllOrders).post(authenticateUser, createOrder);
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);
router.route('/:id').get(authenticateUser,getSingleOrder).patch(authenticateUser, updateOrder);

module.exports=router;