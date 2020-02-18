import ApiProblem from 'express-api-problem';
import { INTERNAL_SERVER_ERROR } from "http-status-codes";
import { logErrDetails } from '../helper/logger';
import cmn  from '../helper/common';


/**
 * Intercepts the exceptions and logs them if required
 * @param err
 * @param req
 * @param res
 * @param next
 * @return {module.exports}
 * @constructor
 */
export function ExceptionHandlerMiddleware(err, req, res, next) {
  // Continue if it is not an error
  if (!(err instanceof ApiProblem) && !(err instanceof Error)) {
    return next();
  }

  let additionalData = {
    code: err.code,
    httpStatus: err.status || INTERNAL_SERVER_ERROR,
    requestUrl: req.originalUrl
  };

  // if og ApiProblem
  if (err instanceof ApiProblem) {
    let { meta } = err;
    additionalData = { ...meta, ...additionalData };
  }

  const formattedResponse = {
    ...additionalData,
    message: `Express boilerplate – ${ JSON.stringify(err, cmn.replaceErrors) }`,
  };

  // log error
  logErrDetails({ message: 'Error handled in middleware' , error: err, additionalData });

  return res.status(err.status || INTERNAL_SERVER_ERROR).json(formattedResponse);
}
