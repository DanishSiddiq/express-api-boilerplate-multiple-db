import { config } from '../helper/config';
import { logInfoDetails } from '../helper/logger';
import { dbService } from './mongo.db';
import { rewardsSchema } from '../models/scholarship/rewards-model';

let scholarshipConnection;

/**
 *
 * @param label
 */
const setupScholarshipConnection = (label) => {
    scholarshipConnection = connectDatabase(label);
    logInfoDetails({ message: `${label} database connected` });

    return scholarshipConnection;
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

const getRewardsModel = () => {
    // defining models based on schema for multiple connections
    return scholarshipConnection.model('student', rewardsSchema, 'student');
};

module.exports = {
    setupScholarshipConnection,
    getRewardsModel
};
