import { Request, Response, NextFunction } from 'express';

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): Response => {
  // console.error(err.stack);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors,
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = err.message.match(/index: (.+?) dup key/);
    const fieldName = field ? field[1].split('_')[0] : 'field';

    let errorMessage = '';

    switch (fieldName) {
      case 'email':
        errorMessage = 'Email already registered, please use another email';
        break;
      default:
        errorMessage = 'An error occurred';
    }

    return res.status(409).json({
      message: 'Duplicate key error',
      error: errorMessage,
    });
  }

  if (err.name === 'MongoError') {
    return res.status(500).json({
      message: 'MongoDB error',
      error: err.message,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
      error: err.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
    error: err.message,
  });
};

export { errorHandler, CustomError };