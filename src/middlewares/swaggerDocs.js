import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { SWAGGER_PATH } from '../constants/path.js';
import createHttpError from 'http-errors';

export const swaggerDocs = () => {
  try {
    const swaggerDocument = JSON.parse(
      fs.readFileSync(SWAGGER_PATH).toString(),
    );
    return [...swaggerUi.serve, swaggerUi.setup(swaggerDocument)];
  } catch (err) {
    console.error(err);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load Swagger file"));
  }
};
