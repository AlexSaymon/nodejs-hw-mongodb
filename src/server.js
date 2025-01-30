import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { ENV_VARS } from './constants/env.js';
import { getEnv } from './utils/getEnv.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { router } from './routes/index.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());

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

  app.use(errorHandlerMiddleware);

  app.use((req, res) => {
    return res.status(404).json({
      message: 'Not Found',
    });
  });

  const PORT = getEnv(ENV_VARS.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
