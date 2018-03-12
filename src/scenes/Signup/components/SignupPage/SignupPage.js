import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Paper from 'material-ui/Paper'
import { withFirebase } from 'react-redux-firebase'
import { withHandlers, pure, compose } from 'recompose'
import { UserIsNotAuthenticated } from 'utils/router'
import { withNotifications } from 'modules/notification'
import { LOGIN_PATH } from 'constants'
import SignupForm from '../SignupForm'
import {connect} from 'react-redux'
import {withAuth} from './Callback';
import Card from 'material-ui/Card';


import classes from './SignupPage.scss'

export const SignupPage = withAuth(({ emailSignup, spotifyReducer, onSubmitFail, }) => (
	<div className={classes.container}>
		<Card className={classes.panel}>
			<SignupForm 
				onSubmit={emailSignup} 
				user={spotifyReducer.user} 
				initialValues={ {
					displayName: spotifyReducer.user.id,
					email: spotifyReducer.user.email,
					} }
					onSubmitFail={onSubmitFail} />
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
))

SignupPage.propTypes = {
	emailSignup: PropTypes.func,
	onSubmitFail: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    spotifyReducer: state.spotifyReducer
  };
}

export default compose(
	UserIsNotAuthenticated, // redirect to list page if logged in
	pure,
	withNotifications, // add props.showError
	withFirebase, // add props.firebase (firebaseConnect() can also be used)
	state => state,
    connect(mapStateToProps),
	withHandlers({
		onSubmitFail: props => (formErrs, dispatch, err) =>
		props.showError(formErrs ? 'Form Invalid' : err.message || 'Error'),
        emailSignup: ({ spotifyReducer, firebase, showError }) => creds =>{
		firebase
		.createUser(creds, {
			email: creds.email,
			displayName: creds.displayName,
            accessToken: spotifyReducer.accessToken,
            refreshToken: spotifyReducer.refreshToken,
            //device: creds.device
		})
		.catch(err => showError(err.message))
		}
	}),
)(SignupPage)
