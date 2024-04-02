import express from "express";
import dotenv from 'dotenv'// Load environment variables from .env file
import { userRoute } from "./routes/userRouter.js"; //.js must
import { notFound,errorHandler } from "./middleware/errorMiddleware.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors middleware
import nocache from 'nocache';
dotenv.config()
const app=express()
const { PORT, MONGO_URL } = process.env;

const database=async()=>{

 await mongoose.connect(MONGO_URL).then(()=>{
  console.log("Database Connected")
  }).catch((e)=>{app.use('/',userRoute)
  console.log(e.message)
  })
}

// Use nocache middleware to prevent caching
app.use(nocache());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',userRoute)
app.use(notFound)
app.use(errorHandler)  // If the notFound middleware is triggered, it will pass the error to the errorHandler middleware.
// If any other error occurs in your application, it will also be passed to the errorHandler middleware.


app.listen(PORT,()=>{
 database()

    console.log(`http://localhost:${PORT}/`)
})

// http://localhost:5000/login, but the server at http://localhost:5000 is not configured to allow requests from http://localhost:3000.

// To resolve this issue, you need to configure your backend server to include the proper CORS headers to allow requests from your frontend application.