import { logInfoDetails } from '../helper/logger';
import { dbService } from './db.mongo';
import { studentSchema } from '../models/student/student-schema';
import { MODEL_DCS } from '../constants/info-constants';

/**
 *
 */
class DbDepartment {

    constructor(dbName) {
        this.dbName = dbName;
        this.connection = null;

        // models
        this.studentModel = null;
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
        this.studentModel = null;
    }

    setupModels = async () => {
        this.studentModel = this.connection.model(MODEL_DCS.STUDENT, studentSchema, MODEL_DCS.STUDENT);
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
        if(await this.isConnectionReady()){
            await this.setupModels();
        }

        let m = {};
        switch (model) {
            case MODEL_DCS.STUDENT:
                m = this.studentModel;
                break;
            default:
                break;
        }

        return m;
    };
}

module.exports = DbDepartment;
