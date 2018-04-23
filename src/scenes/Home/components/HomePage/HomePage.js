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
import Paper from 'material-ui/Paper';


const mapDispatchToProps = (dispatch)=> {
    return({
        changeLocation: (loc) => dispatch(push(loc)),
        sendError: (errorObj) => dispatch(error(errorObj))
    })
}

const enhance = compose(
    firebaseConnect([]),
    connect(
        ({ firebase, firebase: { auth }}) => ({
            uid: auth.uid,
        }),
        mapDispatchToProps
    ),
    withHandlers({
        addNew: props => async Host=>{
            const {sendError, changeLocation, firebase, uid} = props;
            try{
                const ref = firebase.database().ref(`projects/${Host.code}`);
                const snapshot = await ref.once('value');
                const value = snapshot.val();
                if(value != undefined){
                    if(uid == undefined){
                        firebase.auth().signInAnonymously()
                    }
                    changeLocation(`Host/Party/${value.name}`)
                }else 
                    throw new Error("Invalid Host Code")
            }catch(e) {
                sendError({
                    title: 'Error',
                    message: 'Invalid Host Code',
                    position: 'tr',
                });
                console.error(e.message)
            }
        },
    })
)

const Home = ({ addNew, onSubmitFail }) => (
        <div className={classes.HomePage}>
        <Card className={classes.card}>
            <CardMedia  className={""} overlay={<CardTitle title="Connect or Host" subtitle="A local Spotify Party" />} >
            </CardMedia>
            <CardText className={classes.info}>
                <Connect
                    disabled={false}
                    onSubmit={addNew}
                />
                They wanna hear it! Partify lets your guests control the music at home or wherever you are.
            </CardText>
        </Card>
    </div>
)

Home.propTypes = {
    addNew: PropTypes.func.isRequired,
    uid: PropTypes.string
}

export default enhance(Home)
