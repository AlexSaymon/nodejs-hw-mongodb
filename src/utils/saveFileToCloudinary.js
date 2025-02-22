import cloudinary from 'cloudinary';
import { ENV_VARS } from '../constants/env';
import { getEnv } from './getEnv';
import createHttpError from 'http-errors';
import fs from 'node:fs/promises';

cloudinary.config({
  cloud_name: getEnv(ENV_VARS.CLOUDINARY_CLOUD_NAME),
  api_key: getEnv(ENV_VARS.CLOUDINARY_API_KEY),
  api_secret: getEnv(ENV_VARS.CLOUDINARY_API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    const res = await cloudinary.v2.uploader(file.path);
    return res.secure_url;
  } catch (err) {
    console.log(err);
    throw createHttpError(500, 'Failed to upload image to cloudinary');
  } finally {
    await fs.unlink(file.path);
  }
};
