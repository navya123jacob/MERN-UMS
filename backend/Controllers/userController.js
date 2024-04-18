import asyncHandler from 'express-async-handler' //If an error occurs within the wrapped function, it's automatically passed to Express's error handling middleware without needing explicit try...catch
import { User } from '../Models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { cloudinary } from '../utils/CloudinaryConfig.js';

const HomeUser = asyncHandler(async(req, res) => {
    let id=req.query.id
    let user=await User.findOne({_id:id})
    res.json(user);
})

//Register
const registeruserpost = asyncHandler(async(req, res) => {
    const {Fname,Lname,email,password,mno}=req.body
    const myuser=await User.findOne({email:email})
    if(myuser){
        res.json({ message: 'Already present' });
    }
    
        const newuser=await User.create({
            Fname,Lname,mno,password,email,verified:true,
            is_blocked:false
        })
       
   if(newuser){
    generateToken(res,newuser._id)
    res.json({ id:newuser._id,email,password });
   }
   else{
    res.status(400)
    throw new Error('Invalid user data')
   }
   
})

//Login
const loginuserpost = asyncHandler(async(req, res) => {
    const {email,password}=req.body
    const user=await User.findOne({email:email})
    if(user && (await user.matchPasswords(password)) ){
        generateToken(res,user._id)
        res.json({ id:user._id,email,password });
       }
       else{
        res.status(400)
        throw new Error('Invalid email or password')
       }
})

//Logout
const logout = asyncHandler(async(req, res) => {
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    })
    res.json({ message: 'Logout User' });
})

//get profile
const getUserProfile = asyncHandler(async(req, res) => {
    console.log(req.user)
    res.json({ ...req.user._doc });
})

// Update user profile
const updateuser = asyncHandler(async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        user.Fname = req.body.Fname || user.Fname;
        user.Lname = req.body.Lname || user.Lname;
        user.email = req.body.email || user.email;
        
        if (req.body.password) {
            user.password = req.body.password; 
        }

        // Check if req.file exists and upload it to Cloudinary
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                user.image = result.secure_url;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(400).json({ error: 'Failed to upload image to Cloudinary' });
            }
        }

        const updatedUser = await user.save();
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



export { HomeUser,registeruserpost,loginuserpost,logout,updateuser,
getUserProfile};