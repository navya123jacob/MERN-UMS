import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {User} from '../Models/userModel.js'

//session handling
const protect=asyncHandler(async(req,res,next)=>{
let token;
token=req.cookies.jwt;
console.log(token)
if(token){
    try{
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
      console.log('decoded',decoded)
      req.user=await User.findById(decoded.userId).select('-password')
      next()
    }catch(error){
        res.status(401)
        throw new Error('inside,Not authorized,problem with verification')
    }

}
else{
    res.status(401)
    throw new Error("Not authorized,no token")
}
})

export {protect}