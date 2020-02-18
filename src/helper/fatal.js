import mongoose from 'mongoose';
import { logInfoDetails, logErrDetails } from './logger';

/**
 * Gracefully closes the MongoDB connection
 */
function disconnectMongo() {
  mongoose.connection.close(function () {
    logInfoDetails({ message: 'Mongoose default connection disconnected through app termination' })
  });
}

/**
 * Makes sure that the process doesn't shut down
 * for any uncaught errors – and logs them to
 * for easier debugging.
 */
export function handleUncaughtErrors() {
  process.on('unhandledRejection', (err) => {
    logErrDetails({ message: 'Unhandled Rejection', error: err });
  });

  process.on('uncaughtException', (err) => {
    logErrDetails({ message: 'Uncaught Exception', error: err });
  });
}

export function handleExit() {
  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    disconnectMongo();
    process.exit(0);
  });

  process.on('exit', () => {
    disconnectMongo();
    process.exit(0);
  });
}

