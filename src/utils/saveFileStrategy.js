import createHttpError from 'http-errors';
import { ENV_VARS } from '../constants/env';
import { getEnv } from './getEnv';
import { saveFileToCloudinary } from './saveFileToCloudinary';
import { saveFileToLocal } from './saveFileToLocal';

export const saveFile = async (file) => {
  const strategy = getEnv(ENV_VARS.SAVE_FILE_STRATEGY);

  if (strategy === 'local') {
    return await saveFileToLocal(file);
  }

  if (strategy === 'cloudinary') {
    return await saveFileToCloudinary(file);
  }

  throw createHttpError(500, 'No file upload strategy set');
};
