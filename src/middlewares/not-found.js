import ApiProblem from 'express-api-problem';
import { NOT_FOUND } from "http-status-codes";

/**
 * Called for any requests for which no
 * handler was found.
 * @param req
 * @param res
 * @param err
 * @constructor
 */
const RouteNotFoundMiddleware = (req, res, err) => {
  throw new ApiProblem(NOT_FOUND, 'Route not found');
};

module.exports = RouteNotFoundMiddleware;
