import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { ENV_VARS } from './constants/env.js';
import { getEnv } from './utils/getEnv.js';
import { getAllContacts } from './db/services/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    if (!contacts) {
      return res.status(404).json({
        status: 404,
        message: 'Not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Sucesfully found contacts!',
      data: res.json(contacts),
    });
  });

  const PORT = getEnv(ENV_VARS.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
