require('dotenv').config();
require('express-async-errors');

// express 
const express=require('express');
const app=express();

// rest of the packages
const morgan=require('morgan');

// database
const connectDB=require('./db/connectDB');

// middleware 
const notFoundMiddleware=require('./middleware/notFound');
const errorHandlerMiddleware=require('./middleware/errorHandler');


app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).send(`E-Commerce API`);
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port=process.env.PORT || 3000

const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(`something went wrong!`);
    }
}

start();