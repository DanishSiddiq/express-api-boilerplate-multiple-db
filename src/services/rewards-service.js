import { getDB } from '../database-connections/db.connection';
import { DB_NAME_SCHOLARSHIP, MODEL_SCHOLARSHIP } from '../constants/info-constants';
import Repository from '../models/data-access/repository';

/**
 *
 * @param data
 * @returns {Promise<document>}
 */
const createOne = async (data) => {
    const db = await getDB(DB_NAME_SCHOLARSHIP);
    const rewardsModel = await db.getModel(MODEL_SCHOLARSHIP.REWARDS);
    const repository = new Repository(rewardsModel);
    return repository.createOne(data);
};

module.exports = { createOne };


