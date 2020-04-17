import express from 'express';
import bodyParser from 'body-parser';

import router from './routes';

const app = express();
//parse body
app.use(bodyParser.json());
//parse url
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);

export default app;
