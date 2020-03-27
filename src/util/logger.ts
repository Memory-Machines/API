import { Logger, LoggerOptions, transports, createLogger, format } from 'winston';
import path from 'path';

const options: LoggerOptions = {
  exitOnError: false,
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    // Format the metadata object
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  defaultMeta: {
    git: APP_GIT_VERSION,
  },
  transports: [
    // new transports.File({
    //   filename: 'logs/error.log',
    //   level: 'error',
    //   maxFiles: 5,
    //   maxsize: 5242880, // 5MB
    //   format: format.combine(format.json()),
    // }),
    // new transports.File({
    //   filename: 'logs/combined.log',
    //   maxFiles: 5,
    //   maxsize: 5242880,
    //   format: format.combine(
    //     // Render in one line in your log file.
    //     // If you use prettyPrint() here it will be really
    //     // difficult to exploit your logs files afterwards.
    //     format.json()
    //   ),
    // }),
  ],
};

interface ICustomLogger extends Logger {}

const logger: ICustomLogger = createLogger(options);

const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`);

logger.add(
  new transports.Console({
    format: format.combine(format.colorize(), logFormat),
  })
);

class MyStream {
  public write(text: string) {
    // since morgan adds a newline at the end of every debug statement
    logger.info(text.replace(/\n$/, ''), { type: 'ROUTE' });
  }
}

export const winstonStream = new MyStream();

export default logger;
