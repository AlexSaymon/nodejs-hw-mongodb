import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { ENV_VARS } from './constants/env.js';
import { getEnv } from './utils/getEnv.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { router } from './routes/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());

  app.use(
    express.json({
      type: ['application.json', 'application/vnd.api+json'],
    }),
  );

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandlerMiddleware);

  const PORT = getEnv(ENV_VARS.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
