const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// schema here
const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
         default: "user" , // 👈 Default role
        enum: ['inspector', 'surveyor','me','re','are' ,'contractor_rep','consultant_rep','admin','user'],
    },
    time_duration:{
        type:String,   
    }
}, {
    timestamps: true,
}); 

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('user_password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.user_password = await bcrypt.hash(this.user_password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.user_password);
};

// model here
const User = mongoose.model("User", userSchema);
module.exports = User;
