import { config } from '../helper/config';
import { logInfoDetails } from '../helper/logger';
import { dbService } from './mongo.db';
import { studentSchema } from '../models/student/student-model';

let studentConnection;

/**
 *
 * @param label
 */
const setupStudentConnection = (label) => {
    studentConnection = connectDatabase(label);
    logInfoDetails({ message: `${label} database connected` });

    return studentConnection;
};

/**
 *
 * @param dbName
 * @returns {Promise<*>}
 */
const connectDatabase = (dbName) => {
    const mongoOptions = config.get(`MONGO_OPT_${dbName}`, { poolSize: 5, useNewUrlParser: true });
    const mongoOpt = typeof mongoOptions === 'string' ? JSON.parse(mongoOptions) : mongoOptions;
    const mongoURI = config.get(`MONGO_DSN_${dbName}`, '');

    return dbService(mongoURI, mongoOpt, dbName);
};

const getStudentModel = () => {
    return studentConnection.model('student', studentSchema, 'student');
};

module.exports = {
    setupStudentConnection,
    getStudentModel
};
