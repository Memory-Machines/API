const spotify_cred = {
  Authorization:
    process.env.AUTHORIZATION ||
    'Basic *YzlkNGRkZjA3NDc2NDYxOGJiMjQwN2U5MjM0Y2E0NTM6MDQ5MmRiNWYwYjg1NDNjZGE0ODgxYzdjMjJlMGYwZTc=',
  client_secret: process.env.CLIENT_SECRET || '<FILL ME IN>',
  client_id: process.env.CLIENT_KEY || 'c9d4ddf074764618bb2407e9234ca453',
  grant_type: 'authorization_code',
  redirect_uri: 'http://localhost:3002',
  response_type: { code: 'code' },
  state: '34fFs29kd09',
  scope: 'streaming%20user-read-email',
  stateKey: 'spotify_auth_state',
};

export { spotify_cred };
