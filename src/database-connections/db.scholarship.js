import { logInfoDetails } from '../helper/logger';
import { dbService } from './db.mongo';
import { rewardsSchema } from '../models/scholarship/rewards-schema';
import { MODEL_SCHOLARSHIP } from '../constants/info-constants';

/**
 *
 */
class DbScholarship {

    constructor(dbName) {
        this.dbName = dbName;
        this.connection = null;

        // models
        this.rewardsModel = null;
    }

    setupConnection = async () => {

        // connection build up
        this.connection = await dbService(this.dbName);
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

module.exports = DbScholarship;
