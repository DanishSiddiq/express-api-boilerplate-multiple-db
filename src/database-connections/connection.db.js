import { MONGO_CONNECTED } from '../constants/info-constants';
import ConnectionDepartment from  './connection.department';
import ConnectionScholarship from './connection.scholarship';

let connectionDCS;
let connectionScholarship;

/**
 *
 */
const setupConnection = async () => {

  // student
  if(!connectionDCS){
    connectionDCS = new ConnectionDepartment('DCS');
  }

  // checking connection is alive
  if (!connectionDCS.connection || (connectionDCS.connection && !connectionDCS.connection.readyState)){
    await connectionDCS.setupConnection();
  }

  // scholarships
  if(!connectionScholarship){
    connectionScholarship = new ConnectionScholarship('SCHOLARSHIP');
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
const getConnectionDCS = () => connectionDCS;

/**
 *
 * @returns {*}
 */
const getConnectionScholarship = () => connectionScholarship;

/**
 *
 * @returns {*}
 */
const checkConnectionHealthDCS = () => (connectionDCS && connectionDCS.connection.readyState);

/**
 *
 * @returns {*}
 */
const checkConnectionHealthScholarship = () => (connectionScholarship && connectionScholarship.connection.readyState);

/**
 *
 * @returns {Promise<string|null>}
 */
const checkHealthMongoDb = async () => {
  if(checkConnectionHealthDCS() && checkConnectionHealthScholarship()) {
    return MONGO_CONNECTED;
  }

  // reconnect before leaving so next time health will have a ready connection
  setupConnection();

  // returns null since connection opening might will take time in async mode
  return null;
};

module.exports = {
  setupConnection,
  checkHealthMongoDb,
  getConnectionDCS,
  getConnectionScholarship
};
