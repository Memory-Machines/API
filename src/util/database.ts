import mongoose from 'mongoose';
import bluebird from 'bluebird';

import { Logger, CONSTANTS } from './';

mongoose.Promise = bluebird;

async function connectToDb() {
  try {
    const connection = await mongoose.connect(CONSTANTS.config.server.dbUri, {
      useNewUrlParser: true,
      dbName: 'ntb',
      keepAlive: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    Logger.info('Connected to Database');
    return connection;
  } catch (e) {
    throw e;
  }
}

export async function init() {
  try {
    const conn = await connectToDb();
    return conn;
  } catch (e) {
    throw e;
  }
}
