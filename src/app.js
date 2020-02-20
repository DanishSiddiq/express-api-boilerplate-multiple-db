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
import { ConfigLoaderMiddleware } from './middlewares/config-loader';
import { RouteNotFoundMiddleware } from './middlewares/not-found';
import { ExceptionHandlerMiddleware } from './middlewares/exception-handler';

const app = express();

(async function() {
    try {

        handleUncaughtErrors();
        handleExit();

        // Connect to multiple DB's
        if (process.env.NODE_ENV !== 'test') {

            // setup multiple connections
            setupConnection();

            // queue listener
            // initiateRabbitMQ();
        }

        // helmet for security purpose
        app.use(helmet());
        app.disable('x-powered-by');

        // logger
        app.use(morgan('tiny'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ limit: '5mb' }));

        // defining routes inside router or further distribution based on modules
        app.use('/', routerHealth);
        app.use('/', ConfigLoaderMiddleware, routerStudent);
        app.use('/', ConfigLoaderMiddleware, routerRewards);

        // RouteNotFound and ExceptionHandler middle-wares must
        // be the last ones to be registered
        app.use(RouteNotFoundMiddleware);
        app.use(ExceptionHandlerMiddleware);

        app.server = http.createServer(app);
        const APP_PORT = config.get('NODE_PORT', 3000);
        app.server.listen(APP_PORT, () => {
            logInfoDetails({message: 'Express boilerplate app listening on port:', additionalData: {APP_PORT}});
        });
    } catch (err) {
        logErrDetails({ message: 'Express boilerplate server setup failed', error: err });
        process.exit(1);
    }
})();



module.exports = app;

