import mongoose from 'mongoose';
import { getEnv } from '../utils/getEnv.js';
import { ENV_VARS } from '../constants/env.js';

export const initMongoConnection = async () => {
  try {
    const user = getEnv(ENV_VARS.MONGODB_USER);
    const password = getEnv(ENV_VARS.MONGODB_PASSWORD);
    const url = getEnv(ENV_VARS.MONGODB_URL);
    const database = getEnv(ENV_VARS.MONGODB_DATABASE);
    const connectionURI = `mongodb+srv://${user}:${password}@${url}/${database}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(connectionURI);

    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.error('Connection issues', err);
    process.exit(1);
  }
};
