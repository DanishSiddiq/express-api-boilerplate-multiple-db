import { getDCSConnection } from '../database-connections/db.connection';
import Repository from '../models/data-access/repository';

/**
 *
 * @param data
 * @returns {Promise<document>}
 */
const createOne = async (data) => {
    const studentModel  = getDCSConnection().studentModel;
    const repository    = new Repository(studentModel);
    return repository.createOne(data);
};

/**
 *
 * @param whereClause
 * @param data
 * @returns {Promise<Query|*>}
 */
const updateOne = async (whereClause, data) => {
    const studentModel  = getDCSConnection().studentModel;
    const repository = new Repository(studentModel);
    return repository.updateOne({ ...whereClause, _id: whereClause._id }, data);
};

/**
 *
 * @param whereClause
 * @param projection
 * @returns {Promise<Promise<*>|Query|void|Promise<*|undefined>>}
 */
const findOne = async (whereClause, projection = {}) => {
    const studentModel  = getDCSConnection().studentModel;
    const repository = new Repository(studentModel);
    return repository.findOne({ ...whereClause, _id: whereClause._id }, projection);
};

module.exports = { createOne, updateOne, findOne };


