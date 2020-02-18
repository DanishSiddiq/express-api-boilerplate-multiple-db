import { dbService } from './mongo.db';
import { config } from '../helper/config';
import { MONGO_CONNECTED } from '../constants/info-constants';
import { logInfoDetails } from '../helper/logger';

let studentConnection;
let scholarshipConnection;

/**
 *
 * @returns {Promise<void>}
 */
const setupConnection = async () => {
  let label = 'STUDENT';
  if(!studentConnection || (studentConnection && !studentConnection.readyState)) {
    studentConnection = await connectDatabase(label);
    logInfoDetails({ message: `${label} database connected` });
  }

  label = 'SCHOLARSHIP';
  if(!scholarshipConnection || (scholarshipConnection && !scholarshipConnection.readyState)) {
    scholarshipConnection =    await connectDatabase(label);
    logInfoDetails({ message: `${label} database connected` });
  }
};

/**
 *
 * @param dbName
 * @returns {Promise<*>}
 */
const connectDatabase = async (dbName) => {
  const mongoOptions = config.get(`MONGO_OPT_${dbName}`, { poolSize: 5, useNewUrlParser: true });
  const mongoOpt = typeof mongoOptions === 'string' ? JSON.parse(mongoOptions) : mongoOptions;
  const mongoURI = config.get(`MONGO_DSN_${dbName}`, '');

  return dbService(mongoURI, mongoOpt, dbName);
};

/**
 *
 * @returns {Promise<string|null>}
 */
const checkHealthMongoDb = async () => {
  if((studentConnection && studentConnection.readyState)
     && (scholarshipConnection && scholarshipConnection.readyState)) {
    return MONGO_CONNECTED;
  }

  // request new connection before leaving so next time health will have a ready connection
  setupConnection();

  // returns null since connection opening might will take time in async mode
  return null;
};

module.exports = { setupConnection, checkHealthMongoDb, studentConnection, scholarshipConnection };
