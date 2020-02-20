import { getScholarshipConnection } from '../database-connections/db.connection';
import { MODEL_SCHOLARSHIP } from '../constants/info-constants';
import Repository from '../models/data-access/repository';

/**
 *
 * @param data
 * @returns {Promise<document>}
 */
const createOne = async (data) => {
    const rewardsModel  = await getScholarshipConnection().getModel(MODEL_SCHOLARSHIP.REWARDS);
    const repository    = new Repository(rewardsModel);
    return repository.createOne(data);
};

module.exports = { createOne };


