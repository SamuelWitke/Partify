import {
  SPOTIFY_TOKENS,
  SPOTIFY_ME,
  DEVICES,
  SPOTIFY_INIT,
} from 'store/spotify/actionTypes.js';


export function setSpotifyData({accessToken, refreshToken, user}) { 
    return { type: SPOTIFY_INIT, payload: {accessToken, refreshToken,user }}; 
}

export function setTokens({accessToken, refreshToken}) { 
    return { type: SPOTIFY_TOKENS, payload: {accessToken, refreshToken }}; 
}

export function setUser(user) {
    return { type: SPOTIFY_ME, payload: {user}};
}

export function setMyDevice(device) {
    return { type: DEVICES, payload: {device}};
}
