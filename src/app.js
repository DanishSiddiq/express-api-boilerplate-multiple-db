import express from 'express';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// custom
import { handleExit, handleUncaughtErrors } from './helper/fatal';
import { initiateRabbitMQ } from './queues/connection/rabbitmq';
import { logInfoDetails } from './helper/logger';
import { setRouter } from './route';
import { config } from './helper/config';

// middlewares
import { ConfigLoaderMiddleware } from './middlewares/config-loader';
import { RouteNotFoundMiddleware } from './middlewares/not-found';
import { ExceptionHandlerMiddleware } from './middlewares/exception-handler';

handleUncaughtErrors();
handleExit();

const app = express();

// Connect to DB
if (process.env.NODE_ENV !== 'test') {
    // await dbService();

    // queue listener
    // initiateRabbitMQ();
}

// logger
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' }));

// defining routes inside router or further distribution based on modules
app.use('/', ConfigLoaderMiddleware, setRouter(app));

// RouteNotFound and ExceptionHandler middlewares must
// be the last ones to be registered
app.use(RouteNotFoundMiddleware);
app.use(ExceptionHandlerMiddleware);

app.server = http.createServer(app);
const APP_PORT = config.get('NODE_PORT', 3000);
app.server.listen(APP_PORT, () => {
    logInfoDetails({ message: 'Express boilerplate app listening on port:', additionalData: { APP_PORT } });
});
module.exports = app;

