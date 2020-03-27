import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import Mail from 'nodemailer/lib/mailer';
import ejs from 'ejs';
import { readFile } from 'fs';
import util from 'util';

import { Logger, CONSTANTS } from '../util';

export type EmailTemplate = 'newAccount' | 'verifyEmail' | 'otp' | 'frgtPswd';

const asyncReadFile = util.promisify(readFile);
let MODULE_READY = false;
let MODULE_INITIALISING = false;

const ejsString: Record<EmailTemplate, any> = {
  newAccount: null,
  verifyEmail: null,
  otp: null,
  frgtPswd: null,
};

const templates: Record<EmailTemplate, any> = {
  newAccount: null,
  verifyEmail: null,
  otp: null,
  frgtPswd: null,
};

function readTemplates() {
  ejsString.newAccount = asyncReadFile('src/email-templates/account-created.ejs', {
    encoding: 'utf-8',
  });
  ejsString.verifyEmail = asyncReadFile('src/email-templates/verify-email.ejs', {
    encoding: 'utf-8',
  });
  ejsString.otp = asyncReadFile('src/email-templates/otp.ejs', { encoding: 'utf-8' });
  ejsString.frgtPswd = asyncReadFile('src/email-templates/forgot-password.ejs', { encoding: 'utf-8' });
}

function compileTemplates() {
  templates.newAccount = ejs.compile(ejsString.newAccount, {
    cache: true,
    filename: 'newAccount',
  });
  templates.otp = ejs.compile(ejsString.otp, {
    cache: true,
    filename: 'otp',
  });
  templates.verifyEmail = ejs.compile(ejsString.verifyEmail, {
    cache: true,
    filename: 'verifyEmail',
  });
  templates.frgtPswd = ejs.compile(ejsString.frgtPswd, {
    cache: true,
    filename: 'frgtPswd',
  });
}

async function initTemplates() {
  try {
    // todo might be something wrong with this
    if (MODULE_READY || MODULE_INITIALISING) return;
    MODULE_INITIALISING = true;
    Logger.info('Initializing Templates');
    //kicking off parallel execution
    readTemplates();
    // making sure we have everything ready
    ejsString.newAccount = await ejsString.newAccount;
    ejsString.verifyEmail = await ejsString.verifyEmail;
    ejsString.otp = await ejsString.otp;
    ejsString.frgtPswd = await ejsString.frgtPswd;
    // compiling templates
    compileTemplates();
    MODULE_READY = true;
    MODULE_INITIALISING = false;
  } catch (e) {
    MODULE_READY = false;
    MODULE_INITIALISING = false;
  }
}

initTemplates()
  .then(() => Logger.info('Email Templates Ready'))
  .catch(() => Logger.error('Email Templates Failed'));

// Configure Nodemailer SendGrid Transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: CONSTANTS.config.services.sendgrid.apiKey,
    },
  })
);

async function nodeMailerSendEmail(options: Mail.Options) {
  await initTemplates();
  setImmediate(() => {
    transporter.sendMail(options, (err, resp) => {
      if (err) {
        Logger.error(`Failed to send Email to ${options.to} of ${options.subject}`);
        console.log(err);
      } else {
        Logger.info(`Email succesfully sent to ${options.to} of ${options.subject}`);
      }
    });
  });
}

async function nodeMailerSendEmailSync(options: Mail.Options) {
  try {
    await initTemplates();
    await transporter.sendMail(options);
    Logger.info(`Email succesfully sent to ${options.to} of ${options.subject}`);
  } catch (err) {
    Logger.error(`Failed to send Email to ${options.to} of ${options.subject}`);
    console.log(err);
  }
}

interface Email extends Mail.Options {}

interface MailOptions {
  templateData: any;
  template: EmailTemplate;
}

export function sendMail(email: Email, options: MailOptions) {
  setImmediate(() => {
    try {
      const html = templates[options.template](options.templateData);
      email.html = html;
      nodeMailerSendEmail(email);
    } catch (e) {
      console.log(e);
      Logger.error(`Async Failed to generate templat data for email to ${email.to} of ${email.subject}`);
    }
  });
}

export async function sendMailSync(email: Email, options: MailOptions) {
  try {
    const html = templates[options.template](options.templateData);
    email.html = html;
    await nodeMailerSendEmailSync(email);
    return;
  } catch (e) {
    console.log(e);
    Logger.error(`Sync Failed to generate templat data for email to ${email.to} of ${email.subject}`);
  }
}
