import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { ENV_VARS } from './constants/env.js';
import { getEnv } from './utils/getEnv.js';
import { getAllContacts, getContactById } from './db/services/contacts.js';

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
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;

    const contactWithId = await getContactById(contactId);

    if (!contactWithId) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contactWithId,
    });
  });

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
