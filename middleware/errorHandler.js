const errorHandler=(req, res)=>{
    res.status(500).send(`server error!`);
}   

module.exports=errorHandler;