import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema=new mongoose.Schema({
    Fname:{
        type:String,
        required:true
    },
    Lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mno:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    is_Admin:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
        default:'https://res.cloudinary.com/dvgwqkegd/image/upload/v1713420492/intro-1584547451_lgxmf7.jpg'
    }

})
userSchema.index({ Fname: 'text' });
// Hash password before saving user
userSchema.pre('save', async function(next) {
    // Check if password is modified or if it's a new document
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword; // Set hashed password
        next(); // Move to the next middleware or save operation
    } catch (error) {
        next(error); // Pass error to the next middleware
    }
});

userSchema.methods.matchPasswords=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

const User=mongoose.model('User',userSchema)
export {User}


// Inside the pre-save middleware:
// It checks if the password field is modified (this.isModified('password')). If the password is not modified (e.g., during an update operation where the password remains the same), it returns immediately without further execution.
// If the password is modified or it's a new document, it proceeds to hash the password using bcrypt.
// It generates a salt and hashes the password using the salt, and then replaces the plain text password in the document with the hashed password.

// After the password is hashed (if necessary), the user document is saved to the database.

// consider a scenario where you have a Mongoose schema for a user, and you want to hash the password only if it has been modified (i.e., when a new password is set or when an existing password is updated isModified(fieldname))