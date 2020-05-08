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

        // reset models
        await this.resetModels();

        // connection build up
        this.connection = await dbService(this.dbName);
        logInfoDetails({ message: `${this.dbName} database connected` });
    };

    /**
    * reset all models
    */
    resetModels = async () => {
        this.rewardsModel = null;
    }

    setupModels = () => {
        this.rewardsModel = this.connection.model(MODEL_SCHOLARSHIP.REWARDS, rewardsSchema, MODEL_SCHOLARSHIP.REWARDS);
    };

    /**
     * connection state is ready
     */
    isConnectionReady = async () => {
        return this.connection && this.connection.readyState;
    }

    getModel = async (model) => {

        // before returning model, also verify that connection is available and ready
        // if not then create one
        if (!(await this.isConnectionReady())) {
            await this.setupConnection();
        }

        // only setup when connection is ready
        // retry logic can be applied here
        if (await this.isConnectionReady()) {
            await this.setupModels();
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
