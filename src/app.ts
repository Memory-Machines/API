import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import uuid from 'uuid';
import FileStore from 'session-file-store';

const SessionStore = FileStore(session);

import router from './routes';

const app = express();

app.use(
  session({
    genid: (req) => {
      console.log('Inside session middleware genid function');
      console.log(`Request object sessionID from client: ${req.sessionID}`);
      console.log(req.sessionID);
      return uuid(); // use UUIDs for session IDs
    },
    store: new SessionStore(),
    secret: '343ji43j4n3jn4jk3n',
    resave: false,
    saveUninitialized: true,
  })
);

//parse body
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
);
app.use(bodyParser.json());
//parse url
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', router);

export default app;
