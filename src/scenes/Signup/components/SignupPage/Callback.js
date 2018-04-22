import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect }      from 'react-redux'; 
import {push } from 'react-router-redux'
import SpotifyLogin from '../SpotifyLogin/index';
import {cookiesGet} from 'redux-cookies';
import {                                                                                                
	getMyInfo,                                                                                            
	setTokens,                                                                                            
	getMyDevices,
}from './actions.js';         

export const withAuth = (WrappedComponent) => {
	const WithAuthComponent = class extends Component {
		constructor(props) {
			super(props);
			this.state = {
				accessToken : undefined,
			}
		}
		componentDidMount() {
		const {dispatch} = this.props;
			const data = dispatch(cookiesGet('spotify')) || "11{}";
			const str = data.substring(2)
			const x =JSON.parse(str); 
			const accessToken = x.accessToken;
			this.setState({accessToken: accessToken});
			const refreshToken = x.refreshToken;

            //dispatch(getMyDevices(x.devices.devices));
			dispatch(setTokens({accessToken, refreshToken}));
			dispatch(getMyInfo(x.me));
		}
		render() {
			return (
				<div>
				{ this.state.accessToken ? (
					<WrappedComponent {...this.props} 
					/>
      		) : (
						<SpotifyLogin />
      		)}
				</div>
				);
			}
		}

	WithAuthComponent.propTypes = {
		token: PropTypes.string,
		}
	return connect(state => state)(WithAuthComponent)
}
