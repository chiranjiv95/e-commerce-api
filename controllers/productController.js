const Product=require('../models/Product');
const path=require('node:path');

const createProduct=async(req, res)=>{
    req.body.user=req.user.userID;
    const product=await Product.create(req.body)
    res.status(201).json({product});
}

const getAllProducts=async(req, res)=>{
    const products=await Product.find({});
    if(!products){
        return res.status(404).json({msg:'List is empty'});
    }
    res.status(200).json({products, count:products.length})
}

const getSingleProduct=async(req, res)=>{
    const {id:productID}=req.params;
    const product=await Product.findOne({_id:productID})
        .select(['name','description', 'price', 'image', 'company', 'category']);
    if(!product){
        return res.status(404).json({msg:`product with id : ${productID} does not exist`});
    }
    res.status(200).json({product});
}

const updateProduct=async(req, res)=>{
    const {id:productID}=req.params;

    const product=await Product.findOneAndUpdate({_id:productID}, req.body, {new:true, runValidators:true}).select(['name','description', 'price', 'image', 'company', 'category']);
    if(!product){
        return res.status(404).json({msg:`product with id : ${productID} does not exist`});        
    }
    res.status(201).json({product, msg:'success'});

}

const deleteProduct=async(req, res)=>{
    const {id:productID}=req.params;
    const product=await Product.findOne({_id:productID});
    if(!product){
        return res.status(404).json({msg:`product with id : ${productID} does not exist`});        
    }
    
    await product.deleteOne();
    res.status(200).json({msg:`Success`})
}

const uploadImage=async(req, res)=>{
  if(!req.files){
    return res.status(400).json({msg:'No file uploaded'});
  }
  const productImage=req.files.image;
  if(!productImage.mimetype.startsWith('image')){
    return res.status(400).json({msg:'Please uploaded an image'});
  }

  const maxSize=1024*1024;

  if(productImage.size>maxSize){
    return res.status(400).json({msg:'Please uploaded an image smaller than 1MB'});
  }

  const imagePath=path.join(__dirname, '../public/uploads/' + `${productImage.name}`);

  await productImage.mv(imagePath);
  res.status(200).json({image:`/uploads/${productImage.name}`})

}

module.exports={
    createProduct, getAllProducts, getSingleProduct, updateProduct, uploadImage, deleteProduct
}