import 'reflect-metadata';
require('source-map-support').install();

import app from './app';
import { Logger } from './util';
import { init as initializeDatabase } from './util/database';

function giveCleanup(conn: any, server: any) {
  return async function cleanup(event: string) {
    console.info('\nReceived ' + event + ' event');
    await conn.disconnect();
    console.info('DB Connection Closed');
    server.close();
    setTimeout(() => {
      process.exit(1);
    }, 700);
  };
}

async function runServer() {
  try {
    const connection = await initializeDatabase();
    const server = app.listen(app.get('port'), () => {
      Logger.info(`Server started at http://localhost:${app.get('port')}`);
      Logger.info(`Server running in ${app.get('env')} environment`);
      Logger.info(`Server running using ${app.get('configEnv')} config file`);
      Logger.info(`Server running in ${app.get('context')} context`);
    });

    const cleanup = giveCleanup(connection, server);

    [
      'SIGHUP',
      'SIGINT',
      'SIGQUIT',
      'SIGILL',
      'SIGTRAP',
      'SIGABRT',
      'SIGBUS',
      'SIGFPE',
      'SIGUSR1',
      'SIGSEGV',
      'SIGUSR2',
      'SIGTERM',
      'uncaughtException',
    ].forEach((event: NodeJS.Signals) => {
      return process.on(event, () => cleanup(event));
    });

    process.on('exit', function() {
      console.info('\nExiting...');
    });

    // Catch unhandled promise rejections
    process.on('unhandledRejection', err => {
      console.error('Unhandled Rejection --> ', err);
    });

    return server;
  } catch (e) {
    Logger.error('Server initialization failed --> ', e);
  }
}

const serverAsPromise = runServer();

export default serverAsPromise;
