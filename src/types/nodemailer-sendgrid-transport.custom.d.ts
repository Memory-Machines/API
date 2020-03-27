declare module 'nodemailer-sendgrid-transport' {
  export interface SendgridOptions {
    auth: {
      api_key: string;
    };
  }
  function init(options: SendgridOptions): any;
  export default init;
}
