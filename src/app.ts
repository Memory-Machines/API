import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
//need to nom install or add a .d.ts file containing `declare module 'cookie-parser'`
// import cookieParser from 'cookie-parser';

import router from './routes';

const app = express();
//parse body
app.use(bodyParser.json());
//parse url
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', router);

export default app;
