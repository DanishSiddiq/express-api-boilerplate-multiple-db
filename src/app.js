import express from 'express';
import http from 'http';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';
import bodyParser from 'body-parser';

// import { initiateRabbitMQ } from './queues/connection/rabbitmq';
import { setupConnection } from './database-connections/db.connection';
import { handleExit, handleUncaughtErrors } from './helper/fatal';
import { logInfoDetails, logErrDetails } from './helper/logger';

// routers file
import routerHealth from './route/health-check';
import routerStudent from './route/v1/student';
import routerRewards from './route/v1/rewards';

import { config } from './helper/config';

// middle-wares
import ConfigLoaderMiddleware from './middlewares/config-loader';
import RouteNotFoundMiddleware from './middlewares/not-found';
import ExceptionHandlerMiddleware from './middlewares/exception-handler';

const configureServer = async () => {

    const app = express();

        // Connect to multiple DB's
    if (process.env.NODE_ENV !== 'test') {

        // setup multiple connections
        await setupConnection();

        // queue listener
        // initiateRabbitMQ();
    }

    app
    .disable('x-powered-by')
    .use(helmet()) // helmet for security purpose
    .use(morgan('tiny')) // for logging
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json({ limit: '5mb' }))
    .use('/', routerHealth)
    .use('/', ConfigLoaderMiddleware, routerStudent)
    .use('/', ConfigLoaderMiddleware, routerRewards)
    .use(RouteNotFoundMiddleware) // RouteNotFound middle-wares must
    .use(ExceptionHandlerMiddleware); // ExceptionHandler will be the last one to be registered


    return app;
};

module.exports = { configureServer };

