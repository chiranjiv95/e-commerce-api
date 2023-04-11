require('dotenv').config();
require('express-async-errors');

// express 
const express=require('express');
const app=express();

// rest of the packages
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const fileUpload=require('express-fileupload');

// database
const connectDB=require('./db/connectDB');

// routers
const authRouter=require('./routes/authRoutes');
const userRouter=require('./routes/userRoutes');
const productRouter=require('./routes/productRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const orderRouter=require('./routes/orderRoutes')

// middleware 
const notFoundMiddleware=require('./middleware/notFound');


app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload());


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.use(notFoundMiddleware);


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