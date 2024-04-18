import asyncHandler from "express-async-handler";
import { User } from "../Models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { cloudinary } from "../utils/CloudinaryConfig.js";
const authAdmin = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    const admin = await User.findOne({email});

    if(admin && admin.is_Admin && (await admin.matchPasswords(password))){
        generateToken(res, admin._id, true); // Pass true as the third argument for admin
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            profileImage: admin.profileImage,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});



const adminLogout=asyncHandler(async(req,res)=>{


    res.cookie('adminJwt','',{
           httpOnly:true,
           expires:new Date(0)
       })    
   
       res.status(200).json({message:'Admin logged out'})
   
   })



const getUsers = asyncHandler(async(req,res)=>{
    const userData = await User.find({ is_Admin: false }).select('-password').sort({updatedAt:-1});
    res.status(200).json(userData);
   })



const updateUserDetail = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.body._id);
    if(user){

        if (user.image) {
            const publicIdMatch = user.image.match(/\/upload\/v\d+\/([^./]+)\./);
            if (publicIdMatch && publicIdMatch[1]) {
                const publicId = publicIdMatch[1];
                await cloudinary.uploader.destroy(publicId);
            } else {
                console.log('No public_id found in profileImage URL');
            }
        }

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                user.image = result.secure_url;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(400).json({ error: 'Failed to upload image to Cloudinary' });
            }
        }

     
    
        user.Fname = req.body.Fname || user.Fname;
        user.Lname = req.body.Lname || user.Lname;
        user.mno = req.body.mno || user.Lname;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
    
        const updatedUser = await user.save()
    
        res.status(200).json(updatedUser);
        
    
       }else{
        res.status(404);
        throw new Error('User not found')
       }
});



const addNewUser = asyncHandler(async (req, res) => {
    const { Fname, Lname, email, password, mno } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const newUser = await new User({
        Fname,
        Lname,
        email,
        password,
        mno,
        verified: true,
        is_blocked: false
    });
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            newUser.image = result.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(400).json({ error: 'Failed to upload image to Cloudinary' });
        }
    }
    newUser.save()

    if (newUser) {
        generateToken(res, newUser._id);
        res.status(201).json(newUser); // Modify the response data as needed
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const user = await User.findOne({_id:userId});
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }


    if (user.profileImage) {
        const publicIdMatch = user.profileImage.match(/\/upload\/v\d+\/([^./]+)\./);
        if (publicIdMatch && publicIdMatch[1]) {
            const publicId = publicIdMatch[1];
            await cloudinary.uploader.destroy(publicId);
        } else {
            console.log('No public_id found in profileImage URL');
        }
    }
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: 'User deleted' });
});


export {
    authAdmin,
    adminLogout,
    getUsers,
    updateUserDetail,
    addNewUser,
    deleteUser
   }


//    when you include a file input field in your HTML form and submit the form with a file selected, the file will be included in the request body as part of the FormData object. When you use multer middleware in your Express.js server to handle multipart/form-data requests (which includes file uploads), multer automatically parses the incoming request and populates the req.file object with information about the uploaded file.