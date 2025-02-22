import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR_PATH } from '../constants/path';
import { ENV_VARS } from '../constants/env';
import { getEnv } from './getEnv';

export const saveFileToLocal = async (photo) => {
  await fs.rename(photo.path, path.join(UPLOADS_DIR_PATH, photo.filename));

  return `${getEnv(ENV_VARS.BACKEND_DOMAIN)}/uploads/${photo.filename}`;
};
