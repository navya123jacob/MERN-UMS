import express from 'express';
import { HomeUser, registeruserpost, loginuserpost, logout, updateuser, getUserProfile } from '../Controllers/userController.js';
import { protect } from '../middleware/AuthMiddleware.js';
import multer from 'multer';


const userRoute = express.Router();

// Middleware to set cache-control headers
const noCacheMiddleware = (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
};


const fileSizeLimit = 5 * 1024 * 1024;


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit }
});

// Apply noCacheMiddleware to all routes in userRoute
userRoute.use(noCacheMiddleware);

// Define routes
userRoute.get('/user', HomeUser);
userRoute.post('/register', registeruserpost);
userRoute.post('/login', loginuserpost);
userRoute.post('/logout', logout);
userRoute.put('/profile', protect, upload.single('image'), updateuser);
 //  multer middleware for profile image upload

export { userRoute };
