const Product=require('../models/Product');
const Order=require('../models/Order');
const {checkPermissions}=require('../utils/checkPermissions');

const getAllOrders=async(req, res)=>{
    const orders=await Order.find({});
    if(!orders){
        return res.status(200).json({msg:'no orders found'})
    }
    res.status(200).json({orders, count:orders.length});
}

const getSingleOrder=async(req, res)=>{
    const {id:orderID}=req.params;
    const order=await Order.find({_id:orderID});
    if(!order){
        return res.status(404).json({msg:'No order exists for the given ID'})
    }

    // check permissions
    try {
        checkPermissions(req.user, order[0].user);
    } catch (error) {
        return res.status(401).json({msg:'Unauthorized'});
    }
    
    res.status(200).json({order});
}

const updateOrder=async(req, res)=>{
    const {id:orderID}=req.params;
    const {paymentID}=req.body;
    const order=await Order.findOne({_id:orderID});
    if(!order){
        return res.status(404).json({msg:'No order exists for the given ID'})
    }

    // check permissions
    try {
        checkPermissions(req.user, order.user)
    } catch (error) {
        return res.status(401).json({msg:'Unauthorized'});
    }

    order.paymentID=paymentID;
    order.status='pending';
    await order.save();
    res.status(201).json({order, msg:'success'});
}

const getCurrentUserOrders=async(req, res)=>{
    const {userID}=req.user;
    const orders=await Order.find({user:userID});
    if(!orders){
        return res.status(404).json({msg:'No order exists for the given ID'})
    }
    res.status(200).json({orders, count:orders.length})
}

const deleteOrder=async(req, res)=>{
    res.send('update order')
}

// create order - (most complex)
const createOrder=async(req, res)=>{
    const {shippingFee, tax, items}=req.body;

    if(!shippingFee || !tax){
        return res.status(400).json({msg:'please provide shipping fee and tax'})
    }
    if(!items || items.length<1){
        return res.status(400).json({msg:'please provide items'});
    }

    let orderItems=[];
    let subtotal=0;
    // check if product exists
    // for async, use for of loop
    for(const item of items){
        const dbProduct=await Product.findOne({_id:item.product});
        if(!dbProduct){
            return res.status(404).json({msg:'Product not found for the given ID'})
        }
        const {name, image, price, _id}=dbProduct;
        console.log(name, price, _id, image);

        const singleOrderItem={
            name,image,price,quantity:item.quantity, product:_id
        };
        // add item to order
        orderItems=[...orderItems, singleOrderItem];
        // calculate subtotal
        subtotal += item.quantity*price;
    }
    // calculate total
    const total=tax + shippingFee + subtotal;

    // fake client secret, need to setup stripe 
    const clientSecret='clientSecret';
    const paymentID=Math.floor(Math.random()*10);
    // create order
    const order=await Order.create({
        orderItems, total, subtotal, tax, shippingFee, clientSecret,
        user:req.user.userID, paymentID:paymentID.toString()
    })

    res.status(201).json({order, clientSecret:order.clientSecret})
}

module.exports={
    getAllOrders, getSingleOrder, getCurrentUserOrders, updateOrder, deleteOrder, createOrder
}