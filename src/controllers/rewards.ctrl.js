const HttpStatus = require('http-status-codes/index');
import rewardsService from '../services/rewards-service';

/**
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
const createOne = async (request, response) => {
    try {
        const document = await rewardsService.createOne(request.body);
        response.status(HttpStatus.CREATED).json(document);
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = { createOne };

