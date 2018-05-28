import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'; 
import { push } from 'react-router-redux'
import SpotifyLogin from '../../components/SpotifyLogin';
import { setSpotifyData }from 'store/spotify/actions.js';         

export const withAuth = (WrappedComponent) => {
	const WithAuthComponent = class extends Component {

		state = { loading: true}

		componentDidMount() {
			const {setSpotifyData} = this.props;
			const accessToken =  document.cookie.replace(/(?:(?:^|.*;\s*)spotify-access\s*\=\s*([^;]*).*$)|^.*$/, "$1") || undefined
			const refreshToken = document.cookie.replace(/(?:(?:^|.*;\s*)spotify-refresh\s*\=\s*([^;]*).*$)|^.*$/, "$1") || undefined
			/* Due to cookies being stored in a URI format this hack exists */
			const cookieUser = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)spotify-me\s*\=\s*([^;]*).*$)|^.*$/, "$1"))|| undefined;
			console.log(cookieUser);
			const user = cookieUser !== undefined ? JSON.parse(cookieUser.substring(2)) : undefined;
			if(accessToken != undefined && refreshToken != undefined && user != undefined)	{
				setSpotifyData({accessToken,refreshToken,user})
				this.setState({loading: false});
			}
		}
		render() {
			const { loading } = this.state;
			return (
				<div>
				{ !loading ? ( <WrappedComponent {...this.props} />) : ( <SpotifyLogin />) }
				</div>
			);
		}
	}

	WithAuthComponent.propTypes = {
		token: PropTypes.string,
	}
	return connect(
		null, 
		(dispatch) => ({ 
			setSpotifyData: data => dispatch(setSpotifyData(data))
		})
		)(WithAuthComponent)
}
