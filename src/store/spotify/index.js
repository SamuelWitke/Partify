import {
	SPOTIFY_TOKENS,
	SPOTIFY_ME,
	DEVICES,
	SPOTIFY_INIT,
} from './actionTypes.js';

import Immutable from 'immutable';

const initialState = Immutable.fromJS({ 
	accessToken: null,
	refreshToken: null,
	devices: null,
	user: {}
});

const handleSpotifyInit = (state,action) => {
		const {accessToken, refreshToken, user} = action.payload;
		return state
				.set('accessToken',accessToken) 
				.set('refreshToken',refreshToken)
				.set('user',Immutable.fromJS(user));
}

const handleSetSpotifyTokens = (state,action) =>{
		const {accessToken, refreshToken} = action.payload;
		return state
				.set('accessToken',accessToken) 
				.set('refreshToken',refreshToken);
}

const handleSetSpotifyUser = (state,action) => {
	const { user } = action.payload;
		return state.withMutations( state => state
			.set('user',Immutable.fromJS(user))
	);
}

const handleSetDevices = (state,action) => {
	const { devices } = action.payload;
	return state.withMutations( state => state
		.set('devices',devices)
	);
}

export function reducer(state = initialState, action) {
	switch (action.type) {
	  case SPOTIFY_INIT: return handleSpotifyInit(state,action);
		case SPOTIFY_TOKENS: return handleSetSpotifyTokens(state,action);
		case SPOTIFY_ME: return handleSetSpotifyUser(state,action);
		case DEVICES: return handleSetDevices(state,action);
		default: return state; 
	}
}


