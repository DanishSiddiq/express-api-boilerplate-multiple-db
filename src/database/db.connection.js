import { MONGO_CONNECTED } from '../constants/info-constants';
import { setupStudentConnection } from  './student.connection';
import { setupScholarshipConnection } from  './scholarship.connection';

let studentConnection;
let scholarshipConnection;

/**
 *
 */
const setupConnection = () => {

  // student
  if(!studentConnection || (studentConnection && !studentConnection.readyState)) {
    studentConnection = setupStudentConnection('STUDENT');
  }
    // scholarship
    if (!scholarshipConnection || (scholarshipConnection && !scholarshipConnection.readyState)) {
      studentConnection = setupScholarshipConnection('SCHOLARSHIP');
    }
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

/**
 *
 * @returns {*}
 */
const getStudentConnection = () => studentConnection;

/**
 *
 * @returns {*}
 */
const getScholarConnection = () => scholarshipConnection;

module.exports = { setupConnection, checkHealthMongoDb, getStudentConnection, getScholarConnection };
