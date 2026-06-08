// utils/errorHandler.ts
import { Response } from 'express';
import { ValidationError } from 'class-validator';

export const handleControllerError = (error: any, res: Response) => {
  // Extract status code if it exists and is not 500
  let statusCode = error?.statusCode && error.statusCode !== 500 ? error.statusCode : 500;
  
  // Mask the message if it's a 500 internal server crash
  let message = statusCode !== 500 ? error.message : "Internal Server Error";

  
   if (Array.isArray(error) && error[0] instanceof ValidationError) {
    statusCode = 400; // Validation is always a Bad Request
    
    // Extract all user-friendly constraint messages and join them
    message = error
      .map((err: ValidationError) => Object.values(err.constraints || {}).join(', '))
      .join(' | ');
  } 
  
  
  // Log actual 500 errors to your console/logs for debugging
  if (statusCode === 500) {
    console.error("💥 System Error Details:", error);
  }

  return res.status(statusCode).json({
    success: false,
    message: message || "Validation or request failed",
  });
};
