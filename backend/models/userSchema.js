import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First Name must contain 3 characters"]
    },

    lastName:{
        type:String,
        required:true,
        minLength:[3,"Last Name must contain 3 characters"]
    },

    email:{
        type:String,
        required:true,
        validate:[validator.isEmail, "Please provide a valid email"]
    },

    phone:{
        type:String,
        required:true,
        minLength:[11,"Number must contain 11 digits"],
        maxLength:[11,"Number must contain 11 digits"],
    },

    nic:{
        type:String,
        required:true,
        minLength:[11,"NIC must contain 11 digits"],
        maxLength:[11,"NIC must contain 11 digits"],
    },
       dob:{
           type: Date,
           required:[true,"DOB is require"],
       },
        gender:{
          type:String,
          required:true,
          enum:["Male","Female"],
        },
        password:{
            type:String,
            minLength:[8,"Password must contain atleast 8 characters"],
            required:true,
            select:false,
        },
        role: {
            type:String,
            required:true,  
            enum:["Admin","Patient","Doctor"],
        },
        doctorDepartment:{
            type:String,
        },
        doctorPrice: {
            type: Number,
            min: [0, "Price must be a positive number"]
        },
         docAvatar:{
            public_id:String,
            url:String,
         },
});

// Convert user password to its hash value.
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
      this.password = await bcrypt.hash(this.password,10);
});



// compare the password with hash value
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

//generate token when user login to website
userSchema.methods.generateJsonWebToken = function(){
     return jwt.sign({id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES,
     });
};

export const User = mongoose.model("User",userSchema);