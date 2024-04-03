import express from 'express';
import { 
    authAdmin,
    adminLogout,
    getUsers,
    updateUserDetail,
    addNewUser,
    deleteUser
 } from "../Controllers/adminController.js";
// import { adminProtect } from '../middleware/adminAuthMiddleware.js';
import multer from 'multer';


const adminRouter = express.Router();


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


adminRouter.post('/',authAdmin);
adminRouter.post('/logout',adminLogout);

adminRouter
    .route('/users')
    .get(getUsers)
    .post(upload.single('image'),addNewUser)
    .delete(deleteUser);

// adminRouter.put('/profile',adminProtect,upload.single('image'),updateUserDetail);
adminRouter.put('/profile',upload.single('image'),updateUserDetail);


export default adminRouter