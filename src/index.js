import { TEMP_DIR_PATH, UPLOADS_DIR_PATH } from './constants/path.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNotExists } from './utils/сreateDirIfNotExists.js';

await createDirIfNotExists(TEMP_DIR_PATH);
await createDirIfNotExists(UPLOADS_DIR_PATH);
await initMongoConnection();
setupServer();
