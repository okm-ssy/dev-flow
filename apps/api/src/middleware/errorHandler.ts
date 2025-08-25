import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../models/types';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('API Error:', error);

  // Default error response
  const response: ApiResponse = {
    success: false,
    error: 'Internal server error',
  };

  // Handle different types of errors
  if (error.message.includes('Database')) {
    response.error = 'Database error';
    return res.status(500).json(response);
  }

  if (error.message.includes('Validation')) {
    response.error = 'Validation error';
    return res.status(400).json(response);
  }

  if (error.message.includes('not found')) {
    response.error = 'Resource not found';
    return res.status(404).json(response);
  }

  // Generic error response
  if (process.env.NODE_ENV === 'development') {
    response.error = error.message;
  }

  res.status(500).json(response);
};