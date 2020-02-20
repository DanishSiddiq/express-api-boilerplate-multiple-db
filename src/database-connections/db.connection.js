import { MONGO_CONNECTED } from '../constants/info-constants';
import StudentConnection from  './student.connection';
import ScholarshipConnection from './scholarship.connection';

let connectionDCS;
let connectionScholarship;

/**
 *
 */
const setupConnection = async () => {

  // student
  if(!connectionDCS){
    connectionDCS = new StudentConnection('DCS');
  }

  // checking connection is alive
  if (!connectionDCS.connection || (connectionDCS.connection && !connectionDCS.connection.readyState)){
    await connectionDCS.setupConnection();
  }

  // scholarships
  if(!connectionScholarship){
    connectionScholarship = new ScholarshipConnection('SCHOLARSHIP');
  }

  // checking connection is alive
  if (!connectionScholarship.connection || (connectionScholarship.connection && !connectionScholarship.connection.readyState)){
    await connectionScholarship.setupConnection();
  }
};

/**
 *
 * @returns {*}
 */
const getDCSConnection = () => connectionDCS;

/**
 *
 * @returns {*}
 */
const getScholarshipConnection = () => connectionScholarship;

/**
 *
 * @returns {Promise<string|null>}
 */
const checkHealthMongoDb = async () => {
  if((connectionDCS && connectionDCS.connection.readyState)
     && (connectionScholarship && connectionScholarship.connection.readyState)) {
    return MONGO_CONNECTED;
  }

  // reconnect before leaving so next time health will have a ready connection
  setupConnection();

  // returns null since connection opening might will take time in async mode
  return null;
};

module.exports = { setupConnection, checkHealthMongoDb, getDCSConnection, getScholarshipConnection };
