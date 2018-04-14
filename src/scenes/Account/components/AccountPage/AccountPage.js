import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import { spinnerWhileLoading } from 'utils/components'
import { UserIsAuthenticated } from 'utils/router'
import AccountForm from '../AccountForm'
import defaultUserImageUrl from 'static/User.png'
import {push} from 'react-router-redux'
import classes from './AccountPage.scss'
import { success, error, warning, info, removeAll } from 'react-notification-system-redux';

export const AccountPage = ({ avatarUrl, updateAccount, profile }) => (
    <div className={classes.container}>
        <Paper className={classes.pane}>
            <div className={classes.settings}>
                <div className={classes.avatar}>
                    <img
                        className={classes.avatarCurrent}
                        src={avatarUrl || defaultUserImageUrl}
                    />
                </div>
                <div className={classes.meta}>
                    <AccountForm
                        onSubmit={updateAccount}
                        account={profile}
                        initialValues={profile}
                    />
                </div>
            </div>
        </Paper>
    </div>
)

AccountPage.propTypes = {
    avatarUrl: PropTypes.string,
    profile: PropTypes.object,
    updateAccount: PropTypes.func
}

export default compose(
    UserIsAuthenticated, // redirect to /login if user is not authenticated
    withFirebase, // adds props.firebase
    connect(({ firebase:{ auth },firebase: { profile }, hostReducer }) => ({
        auth,
        hostReducer,
        profile,
        avatarUrl: profile.avatarUrl
    })),
    spinnerWhileLoading(['profile']),
    withHandlers({
        updateAccount: ({firebase, hostReducer, dispatch}) => newAccount =>{
            try{
                firebase.updateProfile({
                    displayName: newAccount.displayName,
                    email: newAccount.email,
                })         
                if(hostReducer != undefined){
                    dispatch(push(`Host/Party/${hostReducer}`))
                }else{
                    dispatch(push(`/`))
                }
            }catch(e){
                dispatch(error({
                    title: 'Error',
                    message: e.message,
                    position: 'tr',
                }));
            }
        }})
)(AccountPage)
