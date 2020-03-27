import { EmailTemplate } from '../services/mailer';
import config from 'config';

interface IServerCOnfig {
  context: 'local' | 'development' | 'production' | 'sandbox' | 'test';
  env: 'development' | 'production';
  app: string;
  port: number;
  admin: string;
  dbUri: string;
  jwtSecret: string;
}

interface IServicesConfig {
  sendgrid: {
    apiKey: string;
  };
}

interface EmailInfo {
  template: EmailTemplate;
  subject: string;
  from: string;
  loginUrl?: string;
}

const server: IServerCOnfig = config.get('server');
const services: IServicesConfig = config.get('services');

const appConfig = {
  server,

  services,
};

const EMAIL_DATA: Record<EmailTemplate, EmailInfo> = {
  newAccount: {
    template: 'newAccount',
    subject: 'Welcome to Node Typescript Boilerplate!',
    loginUrl: `${appConfig.server.app}/signup`,
    from: 'Node Typescript Boilerplate Account no-reply@tusharf5.com',
  },
  verifyEmail: {
    template: 'verifyEmail',
    subject: '',
    loginUrl: `${appConfig.server.app}/login`,
    from: 'Node Typescript Boilerplate Account no-reply@tusharf5.com',
  },
  otp: {
    template: 'otp',
    subject: '',
    loginUrl: `${appConfig.server.app}/login`,
    from: 'Node Typescript Boilerplate Account no-reply@tusharf5.com',
  },
  frgtPswd: {
    template: 'frgtPswd',
    subject: 'Node Typescript Boilerplate Password Change Request',
    from: 'Node Typescript Boilerplate Account no-reply@tusharf5.com',
  },
};

export default {
  EMAIL_DATA,
  config: appConfig,
};
