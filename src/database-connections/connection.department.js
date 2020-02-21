import { config } from '../helper/config';
import { logInfoDetails } from '../helper/logger';
import { dbService } from './db.mongo';
import { studentSchema } from '../models/student/student-schema';
import { MODEL_DCS } from '../constants/info-constants';

/**
 *
 */
class ConnectionDepartment {

    constructor(dbName) {
        this.dbName = dbName;
        this.connection = null;

        // models
        this.studentModel = null;
    }

    setupConnection = async () => {

        const mongoOptions  = config.get(`MONGO_OPT_${this.dbName}`, { poolSize: 5, useNewUrlParser: true });
        const mongoOpt      = typeof mongoOptions === 'string' ? JSON.parse(mongoOptions) : mongoOptions;
        const mongoURI      = config.get(`MONGO_DSN_${this.dbName}`, '');

        this.connection = await dbService(mongoURI, mongoOpt, this.dbName);
        await this.setupModels();

        logInfoDetails({ message: `${this.dbName} database connected` });
    };

    setupModels = async () => {
        this.studentModel = this.connection.model(MODEL_DCS.STUDENT, studentSchema, MODEL_DCS.STUDENT);
    };

    getModel = async (model) => {

        // before returning model, also verify that connection is available and ready
        // if not then create one
        if (!this.connection || !this.connection.readyState) {
            await this.setupConnection();
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

module.exports = ConnectionDepartment;
