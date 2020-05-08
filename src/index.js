import 'express-async-errors';
import http from 'http';

import { config } from './helper/config';
import { handleExit, handleUncaughtErrors } from './helper/fatal';
import { logInfoDetails, logErrDetails } from './helper/logger';
import { configureServer } from './app';

let app;
(async function() {
    try {

        // configure server
        app = await configureServer();

        // configure exceptions
        handleUncaughtErrors();
        handleExit();

        // start server
        const APP_PORT = config.get('NODE_PORT', 3000);
        app.server = http.createServer(app);
        app
           .server
           .listen(APP_PORT, () => {
               logInfoDetails({message: `Express boilerplate app listening on port:${APP_PORT}`});
           });

    } catch (err) {
        logErrDetails({ message: 'Express boilerplate server setup failed', error: err });
        process.exit(1);
    }
})();



module.exports = app;

