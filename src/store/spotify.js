export const SPOTIFY_TOKENS = 'SPOTIFY_TOKENS';
export const SPOTIFY_ME= 'SPOTIFY_ME';
export const DEVICES = 'DEVICES';

const initialState = {                                                                                  
	accessToken: null,                                                                                    
	refreshToken: null,                                                                                   
	devices: null,
	user: {                                                                                               
		country: null,                                                                                      
		display_name: null,                                                                                 
		email: null,                                                                                        
		external_urls: {},                                                                                  
		followers: {},                                                                                      
		href: null,                                                                                         
		id: null,                                                                                           
		images: [],                                                                                         
		product: null,                                                                                      
		type: null,                                                                                         
		uri: null,                                                                                          
		}                                                                                                     }; 
export default function reduce(state = initialState, action) {                                          
	switch (action.type) {                                                                                
	case SPOTIFY_TOKENS:                                                                                  
		const {accessToken, refreshToken} = action;                                                         
		return Object.assign({}, state, {accessToken, refreshToken});
	case SPOTIFY_ME:                                                                              
		return Object.assign({}, state, {                                                                   
			user: Object.assign({}, state.user, action.data)}); 
	case DEVICES:                                                                              
		const {devices} = action;                                                         
		console.log("HERE",devices);
		return Object.assign({}, state, {devices});
	default:
		return state; 
	}
}
