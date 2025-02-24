import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  } = req.body;
    if(
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !role 
    ){
        return next(new ErrorHandler("Please fill all the field",400));
    }
     let user = await User.findOne({ email });
      if(user){
        return next(new ErrorHandler("User already registered",400));
      }
       user = await User.create({ firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    });
        generateToken(user,"User Registered",200,res); 
});

//If login information is missing or not valid
export const login = catchAsyncErrors(async(req,res,next) => {
      const {email,password,confirmPassword,role} = req.body;

         if(!email || !password || !confirmPassword || !role){
               return next(new ErrorHandler("Please provide the required details",400));
         }
          //check login password is correct or not
          if(password !== confirmPassword){
          return next(new ErrorHandler("Password is incorrect!",400));
          }

          //check the login user is a valid user and its info is register in database or not
          const user = await User.findOne({email}).select("+password");
          if(!user){
            return next(new ErrorHandler("Invalid Password or Email",400));
          }

          const isPasswordMatched = await user.comparePassword(password);
          if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid Password or Email",400));
          }
          if(role !== user.role){
            return next(new ErrorHandler("User with this role is not found",400));
          }
          generateToken(user,"User Login Successfully!",200,res);
});

// Add new admin

export const addNewAdmin = catchAsyncErrors(async(req,res,next)=>{
  const {firstName,lastName,email,phone,password,gender,dob,nic} = req.body;
  if(
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic)
{
    return next(new ErrorHandler("Please fill all the field",400));
}
const isRegistered = await User.findOne({email});
   if(isRegistered){
      return next(new ErrorHandler(`${isRegistered.role} with this Email is Already Exist`));
   }
    //if new admin introduce then register his/her data in database
const admin = await User.create({
  firstName,
  lastName,
  email,
  phone,
  password,
  gender,
  dob,
  nic,
  role:"Admin",
});
 res.status(200).json({
   success:true,
   message:"New Admin Added Successfully",
 });
});

//Get the doctors

export const getAllDoctors = catchAsyncErrors(async(req,res,next)=>{
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
      success:true,
      doctors,
    });
});

//Get the user details

export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
      const user = req.user;
      res.status(200).json({
        success:true,
        user,
      });
});

//Admin Logout process
export const logoutAdmin = catchAsyncErrors(async(req,res,next)=>{
   res.status(200).cookie("adminToken","",{
    httpOnly:true,
    expires:new Date(Date.now()),
   }).json({
    success:true,
    message:"Admin Logout Successfully"
   })
});

//user Logout process

export const logoutPatient = catchAsyncErrors(async(req,res,next)=>{
  res.status(200).cookie("patientToken","",{
   httpOnly:true,
   expires:new Date(Date.now()),
  }).json({
   success:true,
   message:"Patient Logout Successfully"
  })
});

//Here we add new doctors
export const addNewDoctor = catchAsyncErrors(async(req,res,next) =>{
     if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Image Required",400));
     }

     const {docAvatar} = req.files;
     const allowedFormats = ["image/png","image/jpeg","image/jpg","image/webp"];
     if(!allowedFormats.includes(docAvatar.mimetype)){
      return next(new ErrorHandler("Image Format Not Supported!",400));
     }
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        doctorPrice
        } = req.body;

        if( 
          !firstName ||
          !lastName ||
          !email ||
          !phone ||
          !password ||
          !gender ||
          !dob ||
          !nic ||
          !doctorPrice ||
          !doctorDepartment)
          {
             return next(new ErrorHandler("Please provide all details!",400));
          }
          //check user or admin try to register as a doctor
         const isRegistered = await User.findOne({email});
         if(isRegistered){
      return next(new ErrorHandler(`${isRegistered.role} already registered with this email`,400));
         }
         //post images in cloudinary
         const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);

        if(!cloudinaryResponse || cloudinaryResponse.error){
      console.error("Cloudinary Error:",cloudinaryResponse.error || "Unknown Cloudinary Error");
         }

        const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        doctorPrice,
        role:"Doctor",
        docAvatar:{
          public_id:cloudinaryResponse.public_id,
          url:cloudinaryResponse.secure_url,

        },
        });
          res.status(200).json({
            success:true,
            message:"New Doctor Registered!",
            doctor
          });
});