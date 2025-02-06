import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
  }

  if (err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: err.message,
      data: err,
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      status: 400,
      message: err.message,
      errors: err.details.map((err) => ({
        message: err.message,
        path: err.path,
      })),
      data: err,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err,
  });
};
