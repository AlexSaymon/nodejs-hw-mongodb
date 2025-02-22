import fs from 'node:fs/promises';

export const createDirIfNotExists = async (path) => {
  try {
    await fs.access(path);
  } catch (err) {
    console.log(err);

    if (err.code === 'ENOENT') {
      fs.mkdir(path);
    }
  }
};
