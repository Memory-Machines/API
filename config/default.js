module.exports = {
  server: {
    context: 'development',
    env: 'development',
    port: 8080,
    app: '',
    admin: '',
    dbUri: '',
    jwtSecret: '',
  },
  services: {
    sendgrid: {
      apiKey: '',
    },
  },
};
