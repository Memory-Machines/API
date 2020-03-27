import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';

import AdminRouter from './routes/admin';
import ApiRouter from './routes';
import { handleNoMatch, handleException } from './middlewares';
import { winstonStream, CONSTANTS } from './util';

const PROD_LOG = ':method :url :status :response-time ms org :org user :user';
const DEV_LOG = ':method :url :status :response-time ms';
const LOG_LEVEL = CONSTANTS.config.server.context !== 'production' ? DEV_LOG : PROD_LOG;

const app = express();

morgan.token('org', function(req) {
  return req.org ? req.org._id : '-';
});

morgan.token('user', function(req) {
  return req.user ? req.user._id : '-';
});

// Express configuration
app.disable('x-powered-by');
app.set('port', CONSTANTS.config.server.port);
app.set('env', CONSTANTS.config.server.env);
app.set('context', CONSTANTS.config.server.context);

app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SETUP REQUEST LOGGING
if (CONSTANTS.config.server.context !== 'test') {
  app.use(
    morgan(LOG_LEVEL, {
      stream: winstonStream,
      skip: req => {
        return req.originalUrl === '/api/v1/health-status';
      },
    })
  );
}

app.use(passport.initialize());

// SETUP ADMIN ROUTES
app.use('/api/admin', AdminRouter);
// SETUP API ROUTES
app.use('/api/v1', ApiRouter);

// SETUP ROUTE NOT FOUND HANDLER
app.use(handleNoMatch);

// SETUP ERROR HANDLER
app.use(handleException);

export default app;
