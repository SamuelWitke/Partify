import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Paper from 'material-ui/Paper'
import { withFirebase } from 'react-redux-firebase'
import { UserIsNotAuthenticated } from 'utils/router'
import { LOGIN_PATH } from 'constants'
import SignupForm from '../../components/SignupForm'
import {connect} from 'react-redux'
import {withAuth} from './Callback';
import Card from 'material-ui/Card';
import { error } from 'react-notification-system-redux';
import classes from './SignupPage.scss'

@withFirebase // add props.firebase (firebaseConnect() can also be used)
@connect(
		({Spotify}) => ({ Spotify }),
		(dispatch) => ({ sendError: err => dispatch(error(err)),})
)
class SignupPage extends React.PureComponent {
	onSubmitFail = (error) => {
		const { sendError } = this.props;
		const Key = Object.keys(error);
		sendError({
			title: `Error in feild ${Key[0]}`,
			message: error[Key],
			position: 'tr',
			autoDismiss: 0,
		})
	}

	emailSignup = creds =>{
		const { Spotify, firebase, sendError } = this.props;
		firebase
			.createUser(creds, {
				email: creds.email,
				displayName: creds.displayName,
				accessToken: Spotify.get('accessToken'),
				refreshToken: Spotify.get('refreshToken'),
			}).catch(err => { 
				sendError({
					title: 'Error',
					message: err.message,
					position: 'tr',
					autoDismiss: 0,
				})

			})
	}

	render(){
		const { Spotify } = this.props;
		return (
			<div className={classes.container}>
				<Card className={classes.panel}>
					<SignupForm 
						initialValues={ {
							displayName: Spotify.getIn(['user','id']),
							email: Spotify.getIn(['user','email']),
						}}
						onSubmit={this.emailSignup} 
						onSubmitFail={this.onSubmitFail} />
				</Card>
				<div className={classes.providers}>
				</div>
				<div className={classes.login}>
					<span className={classes.loginLabel}>Already have an account?</span>
					<Link className={classes.loginLink} to={LOGIN_PATH}>
						Login
					</Link>
				</div>
			</div>

		)

	}
}
SignupPage.propTypes = {
	emailSignup: PropTypes.func,
	onSubmitFail: PropTypes.func,
}
export default withAuth(SignupPage)
