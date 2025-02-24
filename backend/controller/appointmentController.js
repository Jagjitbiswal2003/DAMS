import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {Appointment} from "../models/appointmentSchema.js";
import {User} from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async(req,res,next) =>{
    const {

        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
    } = req.body;

    if(
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !address
    )
    {
        return next(new ErrorHandler("Please provide all Details!",400));
    }
    //Patient having same name or other same details(conflict of user)
    const isConflict = await User.find({
        firstName:doctor_firstName,
        lastName:doctor_lastName,
        role:"Doctor",
        doctorDepartment:department
    });
       if(isConflict.length === 0){
          return next(new ErrorHandler("Doctor not Found!",404));
       }

       if(isConflict.length > 1){
    return next(new ErrorHandler("Doctors Conflict Please Contact through mail or phone",404));
     }


    //get doctorID and PatientId
    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;
    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor:{
            firstName:doctor_firstName,
            lastName:doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientId
    });
      res.status(200).json({
        success:true,
        message:"Appointment Send Successfully",
        appointment,
      });
});

//Get all Appointment details
export const getAllAppointments = catchAsyncErrors(async(req,res,next) =>{
    const appointments = await Appointment.find();
    res.status(200).json({
        success:true,
        appointments,
    });
});

//Here Admin Update the Appointment Status
export const updateAppointmentStatus = catchAsyncErrors(async(req,res,next) =>{
     //Update the Appointment by using userId
     const {id} = req.params;
     let appointment = await Appointment.findById(id);
     if(!appointment){
        return next(new ErrorHandler("Appointment Not Found",404));
     }
     //Update the appointment status
     appointment = await Appointment.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
     });
     res.status(200).json({
        success:true,
        message:"Appointment Status Updated Successfully",
        appointment,
     });
   }
);

//Delete an Appointment
export const deleteAppointment = catchAsyncErrors(async(req,res,next) =>{
     const {id} = req.params;
     let appointment = await Appointment.findById(id);
     if(!appointment){
        return next(new ErrorHandler("Appointment Not Found",404));
     }
     await appointment.deleteOne();
     res.status(200).json({
        success:true,
        message:"Appointment Deleted Successfully",
     });
});