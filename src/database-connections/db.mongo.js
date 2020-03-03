import mongoose from 'mongoose';
import { config } from '../helper/config';
import { logErrDetails, logInfoDetails } from '../helper/logger';

/**
 *
 * @param label
 * @returns {Connection}
 */
export const dbService = async (label) => {

  const mongoOptions  = config.get(`MONGO_OPT_${label}`, { poolSize: 5, useNewUrlParser: true });
  const options       = typeof mongoOptions === 'string' ? JSON.parse(mongoOptions) : mongoOptions;
  const mongoDsn      = config.get(`MONGO_DSN_${label}`, '');


  mongoose.Promise = global.Promise;
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);

  // setup connection
  let connection = await mongoose.createConnection(mongoDsn, options);

  // If the connection throws an error
  connection.on('error', function (err) {
    logErrDetails({ message: `${ label } default connection error @ ${ mongoDsn }`, error: err });
  });

  // When the connection is disconnected
  connection.on('disconnected', function () {
    logInfoDetails({ message: `${ label } connection disconnected @ ${ mongoDsn }` });
  });

  return connection;
};
