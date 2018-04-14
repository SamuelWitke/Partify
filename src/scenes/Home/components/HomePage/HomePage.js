import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, withHandlers } from 'recompose'
import { withNotifications } from 'modules/notification'
import classes from './HomePage.scss'
import Connect from '../Connect/Connect.js'
import Party from '../../../../static/20151017_000009.jpg'
import {push} from 'react-router-redux'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { firebaseConnect, populate } from 'react-redux-firebase'
import { success, error, warning, info, removeAll } from 'react-notification-system-redux';
import { setHost } from '../../../../store/host.js';


const enhance = compose(
    withNotifications, // adds props.showError from notfication module
     firebaseConnect([]),
    connect(({ firebase, firebase: { auth } }) => ({
        uid: auth.uid,
    })),
    withHandlers({
        addNew: props => async Host=>{
            const ref = props.firebase.database().ref(`projects/${Host.code}`);
            const snapshot = await ref.once('value');
            const value = snapshot.val();
            if(value != undefined){
                if(props.uid == undefined){
                    props.firebase.auth().signInAnonymously()
                }
                props.dispatch(setHost(value.name))
                props.dispatch(push(`Host/Party/${value.name}`))
            } else {
                props.dispatch(error({
                   title: 'Error',
                   message: 'Invalid Host Code',
                   position: 'tr',
                }));
            }
        },
        onSubmitFail: props => (formErrs, dispatch, err) =>
        props.showError(formErrs ? 'Form Invalid' : err.message || 'Error')
    })
)

const Home = ({ addNew, onSubmitFail }) => (
    <Card className={classes.HomePage}>
        <CardMedia  className={classes.container} overlay={<CardTitle title="Connect or Host" subtitle="A local Spotify Party" />} >
                <img src={Party} className={classes.glitch}/>
        </CardMedia>
        <Connect
            disabled={false}
            onSubmit={addNew}
            onSubmitFail={onSubmitFail}
        />
        <CardText className={classes.info}>
            They wanna hear it! Partify lets your guests control the music at home or wherever you are.
        </CardText>
    </Card>
)

Home.propTypes = {
    addNew: PropTypes.func.isRequired,
    onSubmitFail: PropTypes.func.isRequired,
    uid: PropTypes.string
}

export default enhance(Home)
