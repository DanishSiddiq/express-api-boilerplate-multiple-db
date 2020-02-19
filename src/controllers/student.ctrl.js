const HttpStatus = require('http-status-codes/index');
import studentService from '../services/student-service';

/**
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
const createOne = async (request, response) => {
    try {
        const document = await studentService.createOne(request.body);
        response.status(HttpStatus.CREATED).json(document);
    } catch (e) {
        console.log(e);
        throw e;
    }
};

/**
 *
 * @param request
 * @param reply
 */
const updateOne = async (request, reply) => {
    try {
        const result = await studentService.updateOne(request.params, request.query);
        reply.code(result.nModified ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result.nModified === 1 ? { status: "ok" } : {});
    } catch (e) {
        request.log.error(e);
        throw e;
    }
};

/**
 *
 * @param request
 * @param reply
 */
const findOne = async (request, reply) => {
    try {
        const requestParams = { ...request.body, ...request.query, ...request.params };
        const document = await studentService.findOne(requestParams);
        reply.code(document ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(document || {});
    } catch (e) {
        request.log.error(e);
        throw e;
    }
};

module.exports = { findOne, createOne, updateOne };

