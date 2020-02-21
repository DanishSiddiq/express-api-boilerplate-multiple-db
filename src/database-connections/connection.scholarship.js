import { config } from '../helper/config';
import { logInfoDetails } from '../helper/logger';
import { dbService } from './db.mongo';
import { rewardsSchema } from '../models/scholarship/rewards-schema';
import { MODEL_SCHOLARSHIP } from '../constants/info-constants';

/**
 *
 */
class ConnectionScholarship {

    constructor(dbName) {
        this.dbName = dbName;
        this.connection = null;

        // models
        this.rewardsModel = null;
    }

    setupConnection = async () => {

        const mongoOptions  = config.get(`MONGO_OPT_${this.dbName}`, { poolSize: 5, useNewUrlParser: true });
        const mongoOpt      = typeof mongoOptions === 'string' ? JSON.parse(mongoOptions) : mongoOptions;
        const mongoURI      = config.get(`MONGO_DSN_${this.dbName}`, '');

        // connection build up
        this.connection = await dbService(mongoURI, mongoOpt, this.dbName);
        // setting up model based on connection
        await this.setupModels();

        logInfoDetails({ message: `${this.dbName} database connected` });
    };

    setupModels = () => {
        this.rewardsModel = this.connection.model(MODEL_SCHOLARSHIP.REWARDS, rewardsSchema, MODEL_SCHOLARSHIP.REWARDS);
    };

    getModel = async (model) => {

        // before returning model, also verify that connection is available and ready
        // if not then create one
        if (!this.connection || !this.connection.readyState) {
            await this.setupConnection();
        }

        let m = {};
        switch (model) {
            case MODEL_SCHOLARSHIP.REWARDS:
                m = this.rewardsModel;
                break;
            default:
                break;
        }

        return m;
    };

}

module.exports = ConnectionScholarship;
