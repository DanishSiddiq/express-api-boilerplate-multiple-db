import path from 'path';
import fs from 'fs';
import { logErrDetails } from '../helper/logger';
import { SERVICE_UNAVAILABLE, OK } from "http-status-codes";
import { checkHealthMongoDb } from '../database-connections/connection.db';

let version = '';

/**
 * read version from bump config
 * @returns {string|string}
 */
function readVersion() {
  if (version) {
    return version;
  }

  // Read the version configuration from bumpversion config file
  const versionFilePath = path.join(__dirname, '../../.bumpversion.cfg');
  const configContent = fs.readFileSync(versionFilePath, 'utf8');

  // extract the `current_version = {}` value form the file
  const configMatches = /current_version\s*?=\s*?(\d+?\.\d+?\.\d+?)/g.exec(configContent);
  if (!configMatches || !configMatches[1]) {
    console.error(`Could not read version from config file ${versionFilePath}`);
  } else {
    version = configMatches[1];
  }

  return version || '0.0.0';
}

/**
 *
 * @param req
 * @param res
 */
const ping = (req, res) => {
  res.json({
    ok: 'ok',
  });
};

/**
 *
 * @param req
 * @param res
 */
const getVersion = (req, res) => {
  res.json({
    version: readVersion(),
  });
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const checkHealth = async (req, res) => {
  let mongoHealth = null;
  let redisHealth = true;
  let errorMessage = '';

  try {
    mongoHealth = await checkHealthMongoDb();
  } catch (error) {
    errorMessage = error.message;
    logErrDetails({ error, message: 'Error Health api: MongoError' });
  }

  try {
    // redisHealth = await redisCheckHealth();
  } catch (error) {
    errorMessage += error.message;
    logErrDetails({ error, message: 'Error Health api: RedisError' });
  }

  if (redisHealth != null && mongoHealth != null) {
    res.json({
      status: OK,
      version: readVersion(),
      mongo: mongoHealth,
      redis: redisHealth,
    });
  } else {
    logErrDetails({ message: 'Error in health api', additionalData: { redisHealth, mongoHealth } });
    res.status(SERVICE_UNAVAILABLE).json({
      status: SERVICE_UNAVAILABLE,
      message: errorMessage,
    });
  }
};

module.exports = {
  ping,
  getVersion,
  checkHealth,
};
