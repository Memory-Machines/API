import axios from 'axios';
import querystring from 'querystring';

import { mb } from '../types';
import { AxiosResponse } from '../axiosTypes';
import { spotify_cred } from './credentials';

//code will change frequently, this will come back in the url string from the client's (resource owner's) auth login

// async function getSpotifyCode(): string {
//   (this request would actually happen on the client slide)
//   const codeUrl = await axios.get(
//     `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=${response_type}&redirec_uri=${redirect_uri}&scope=${scope}&state=${state}`
//   );
//   return codeUrl;
// }

//for generating cookie

function generateRandomString(length: number) {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyzABCEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function getSpotifyCode() {
  //make axios request to
  try {
    const { scope, client_id, state, redirect_uri, response_type } = spotify_cred;
    const codeUrl = await axios.get(
      `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=${response_type.code}&redirec_uri=${redirect_uri}&scope=${scope}&state=${state}`
    );
    return codeUrl;
  } catch (e) {
    console.log('UtilsSpotifyToken::getSpotifyCode', e);
    throw e;
  }
}

async function getSpotifyToken(code: string) {
  try {
    const { client_secret, client_id, grant_type, redirect_uri } = spotify_cred;
    console.log({ grant_type });
    const body = { client_secret, client_id, grant_type, redirect_uri, code };
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    console.log(JSON.stringify(body, null, 2));
    const { data } = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify(body), {
      headers,
    });
    return data;
  } catch (e) {
    console.log(e.response.data);
    throw e;
  }
}

// async function getUserEmail(token: object) {
//   //check spotify api for how to get user email
//   const res = await axios.get();
// }

export { getSpotifyToken, generateRandomString, getSpotifyCode };
