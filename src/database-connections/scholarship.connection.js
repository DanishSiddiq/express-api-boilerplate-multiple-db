import { config } from '../helper/config';
import { logInfoDetails } from '../helper/logger';
import { dbService } from './mongo.db';
import { rewardsSchema } from '../models/scholarship/rewards-schema';

/**
 *
 */
class ScholarshipConnection {

    constructor(dbName) {
        this.dbName = dbName;
        this.connection = null;

        // models
        this.rewardsModel = null;
    }

    setupConnection = async () => {
        this.connection = await this.connectDatabase();
        this.setupModels();
        logInfoDetails({ message: `${this.dbName} database connected` });
    };

    connectDatabase = async () => {
        const mongoOptions = config.get(`MONGO_OPT_${this.dbName}`, { poolSize: 5, useNewUrlParser: true });
        const mongoOpt = typeof mongoOptions === 'string' ? JSON.parse(mongoOptions) : mongoOptions;
        const mongoURI = config.get(`MONGO_DSN_${this.dbName}`, '');

        return dbService(mongoURI, mongoOpt, this.dbName);
    };

    setupModels = () => {
        this.rewardsModel = this.connection.model('rewards', rewardsSchema, 'rewards');
    };
}

module.exports = ScholarshipConnection;
