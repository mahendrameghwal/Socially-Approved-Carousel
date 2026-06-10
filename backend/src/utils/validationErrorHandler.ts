import { Error } from 'mongoose'; // Import the Error namespace from mongoose
import { Response } from 'express';
import { error } from 'console';

export const handleValidationError = (err: Error.ValidationError, res: Response): void => {
  const validationErrors: Record<string, string> = {};

  // Loop through the validation errors and extract messages
  for (const field in err.errors) {
    if (err.errors[field].message) {
      validationErrors[field] = err.errors[field].message;
    }
  }
  // Send a 400 response with the validation errors
  res.status(400).json({
    message: 'Please check your input and try again.',
    error: validationErrors,
  });
};