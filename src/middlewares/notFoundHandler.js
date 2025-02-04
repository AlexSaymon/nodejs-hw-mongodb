import createHttpError from 'http-errors';

export const notFoundHandler = async (req, res, next) => {
  const error = createHttpError(404, 'Not found');
  next(error);
};
