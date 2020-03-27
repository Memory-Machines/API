module.exports = {
  server: {
    context: 'NODE_CONFIG_ENV',
    env: 'NODE_ENV',
    dbUri: 'DB_URI',
  },
  services: {
    sendgrid: {
      apiKey: 'SENDGRID_API_KEY',
    },
  },
};
