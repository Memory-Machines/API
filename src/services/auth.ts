import bcrypt from 'bcrypt';
import config from 'config';

import { User } from '.';
import { mb } from '../types';
import { getSpotifyToken, getSpotifyCode } from '../utils/spotifyToken';
import axios from 'axios';

const saltRounds = 10;

async function spotifyAuthTokenRequest(code: string) {
  try {
    const data: any = await getSpotifyToken(code);
    const token: mb.SpotifyAuth = {
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
      scope: data.scope,
    };
    return token;
  } catch (e) {
    console.error('authService::spotifyAuthTokenRequest', e);
    throw e;
  }
}

async function getUserEmail(access_token: string) {
  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + access_token,
    };
    const { data } = await axios.get('https://api.spotify.com/v1/me', {
      headers,
    });
    console.log(data);
    return data;
  } catch (e) {
    console.error('authService::spotifyAuthTokenRequest', e);
    throw e;
  }
}

export { spotifyAuthTokenRequest, getUserEmail };
