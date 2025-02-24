class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}


export const errorMiddleware = (err,req,res,next) =>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

  
    //err.code === 11000 - error code 11000 in MongoDB means you're trying to add or update data that already exists in a place where it must be unique, like trying to enter the same email twice in a database where each email must be different. 

    if(err.code === 11000) 
    {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err=new ErrorHandler(message,400);
    }

    //err.name === "JsonWebTokenError" - The JsonWebTokenError is used in Node.js applications when there's an issue with a JSON Web Token (JWT).

    if(err.name === "JsonWebTokenError"){
        const message = "Json Web Token is invalid,Try Again";
        err=new ErrorHandler(message,400);
    }

  // if the jsontoken is expire then this error occur.
    if(err.name === "TokenExpiredError"){
        const message = "Json Web Token is Expired,Try Again";
        err=new ErrorHandler(message,400);
    }

  // This error occurs when the data is entered incorrectly.

    if(err.name === "CastError"){
        const message =`Invalid ${err.path}`;
        err=new ErrorHandler(message,400);
    }


    const errorMessage = err.errors
    ? Object.values(err.errors)
    .map((error) => error.message)
    .join(" ")
    : err.message;

    return res.status(err.statusCode).json({
       success: false,
       message: errorMessage,
    });
  };

export default ErrorHandler;