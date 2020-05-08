import { MONGO_CONNECTED, DB_NAME_DCS, DB_NAME_SCHOLARSHIP } from '../constants/info-constants';
import DBDepartment from  './db.department';
import DBScholarship from './db.scholarship';
import {logErrDetails} from "../helper/logger";

let databases = {
  [DB_NAME_DCS]         : { db: null },
  [DB_NAME_SCHOLARSHIP] : { db: null },
};

/**
 *
 * @returns {Promise<void>}
 */
const setupConnection = async () => {
  try {
    for (let dbName in databases){
      if (!databases[dbName].db){
        switch (dbName) {
          case DB_NAME_DCS:
            databases[dbName].db = new DBDepartment(dbName);
            break;
          case DB_NAME_SCHOLARSHIP:
            databases[dbName].db = new DBScholarship(dbName);
            break;
          default:
            break;
        }
      }

      // checking connection is alive but db should have been created above
      if (databases[dbName].db &&
          (!databases[dbName].db.connection
              || (databases[dbName].db.connection && !databases[dbName].db.connection.readyState))){
        await databases[dbName].db.setupConnection();
      }
    }
  } catch (err) {
    logErrDetails({ message: 'Database is not available', error: err });
  }
};

/**
 *
 * @returns {Promise<string|null>}
 */
const checkHealthMongoDb = async () => {

  let dbConnectionState = true;
  for (let dbName in databases){
    if(!databases[dbName].db || !databases[dbName].db.connection || databases[dbName].db.connection.readyState !== 1){
      dbConnectionState = false;
    }
  }

  // if all connections are fine
  if(dbConnectionState) {
    return MONGO_CONNECTED;
  }

  // reconnect before leaving so next time health will have a ready connection for database if any drops
  setupConnection();

  // returns null since connection opening might will take time in async mode
  return null;
};

/**
 *
 * @param dbName
 * @returns {null|number|IDBDatabase|DbDepartment|DbScholarship}
 */
const getDB = async (dbName) => {
  if(databases[dbName].db){
    return databases[dbName].db;
  }

  // if database was not setup in server setup
  await setupConnection();

  return null;
};

module.exports = {
  setupConnection,
  checkHealthMongoDb,
  getDB
};
