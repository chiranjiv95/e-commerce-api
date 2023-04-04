const errorHandler=(req, res)=>{
    res.status(500).json({msg:'server error!'});
}   

module.exports=errorHandler;