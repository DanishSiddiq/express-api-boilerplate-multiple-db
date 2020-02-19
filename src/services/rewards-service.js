import { getScholarshipConnection } from '../database-connections/db.connection';
import Repository from '../models/data-access/repository';

/**
 *
 * @param data
 * @returns {Promise<document>}
 */
const createOne = async (data) => {
    const rewardsModel  = getScholarshipConnection().rewardsModel;
    const repository    = new Repository(rewardsModel);
    return repository.createOne(data);
};

module.exports = { createOne };


