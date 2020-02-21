import { MONGO_CONNECTED, DB_TYPE_DEPARTMENT, DB_TYPE_SCHOLARSHIP, DB_NAME_DCS, DB_NAME_SCHOLARSHIP } from '../constants/info-constants';
import DBDepartment from  './db.department';
import DBScholarship from './db.scholarship';

let databases = {
  [DB_NAME_DCS]: { type: DB_TYPE_DEPARTMENT, db: null },
  [DB_NAME_SCHOLARSHIP]: { type: DB_TYPE_SCHOLARSHIP, db: null },
};

/**
 *
 * @returns {Promise<void>}
 */
const setupConnection = async () => {
  for (let dbName in databases){
    if(!databases[dbName].db){
      databases[dbName].db = (databases[dbName].type === DB_TYPE_DEPARTMENT ? new DBDepartment(dbName) : new DBScholarship(dbName));
    }

    // checking connection is alive
    if (!databases[dbName].db.connection
        || (databases[dbName].db.connection && !databases[dbName].db.connection.readyState)){
      await databases[dbName].db.setupConnection();
    }
  }
};

/**
 *
 * @returns {Promise<string|null>}
 */
const checkHealthMongoDb = async () => {

  let dbConnectionState = true;
  for (let dbName in databases){
    if(!databases[dbName].db || databases[dbName].db.connection.readyState !== 1){
      dbConnectionState = false;
      break;
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
const getDB = (dbName) => databases[dbName].db;

module.exports = {
  setupConnection,
  checkHealthMongoDb,
  getDB
};
