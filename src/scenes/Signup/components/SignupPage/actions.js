export const SPOTIFY_TOKENS = 'SPOTIFY_TOKENS';  
export const SPOTIFY_ME = 'SPOTIFY_ME'; 
export const DEVICES = 'DEVICES';

export function setTokens({accessToken, refreshToken}) { 
    return { type: SPOTIFY_TOKENS, accessToken, refreshToken }; 
}

export function getMyInfo(data) {
    return dispatch => {
        dispatch({ type: SPOTIFY_ME, data: data});
        }
}

export function getMyDevices(devices) {
    return dispatch => {
        dispatch({ type: DEVICES, devices: devices});
        }
}
