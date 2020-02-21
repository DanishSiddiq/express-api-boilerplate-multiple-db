import mongoose from 'mongoose';
import { logErrDetails, logInfoDetails } from '../helper/logger';

/**
 * Opens connection to MongoDB and binds the listeners
 * for errors, connected and disconnected
 *
 * @var {string} dsn
 * @var {{}} options
 */
export const dbService = (mongoDsn, options, label = 'Mongo') => {
  mongoose.Promise = global.Promise;
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);

  // When successfully connected
  mongoose.connection.on('connected', function () {
    logInfoDetails({ message: `${ label } connected @ ${ mongoDsn }` });
  });

  // If the connection throws an error
  mongoose.connection.on('error', function (err) {
    logErrDetails({ message: `${ label } default connection error @ ${ mongoDsn }`, error: err });
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    logInfoDetails({ message: `${ label } connection disconnected @ ${ mongoDsn }` });
  });

  return mongoose.createConnection(mongoDsn, options);
};
