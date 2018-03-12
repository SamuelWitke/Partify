import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, withHandlers } from 'recompose'
import { withNotifications } from 'modules/notification'
import classes from './HomePage.scss'
import Connect from '../Connect/Connect.js'
import {push} from 'react-router-redux'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { firebaseConnect, populate } from 'react-redux-firebase'
import { success, error, warning, info, removeAll } from 'react-notification-system-redux';


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
            if(value != null){
                if(props.uid == undefined){
                    props.firebase.auth().signInAnonymously()
                }
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
    <Card>
        <CardMedia overlay={<CardTitle title="Connect or Host" subtitle="A local Spotify Party" />} >
            <img src="https://lh3.googleusercontent.com/hrcxOzTTFGAn1veLWGS3Jd2EsVeBDkCGfQcquB_7zS5j0v0XmdJxkU4EloPEl8DinkFv2mpbHoOqBO9pzX6w8F8N0_KWsbJhZzHhVEpROBCpv4tFRllyQsTcOfTAU8SR4kt1lsmepPasWREBDfGhyw4ydGrw7_z14kjzvxpGaefC9G0Evp1zPZVPqlcj6NcdbyBsvzL4y_nRc4gQ-nf-jzzD4Cih_Z8AdZ0GQswHFdXgfMCp2IU6Eq6VO6kSLiS1TL7yavikvNl95TM9BoMuK1CYFpgPM2ntNWeXOVbE0Xwx8E21oEnNNsldWrX-5DR65zKqJI2pyIMc7c_XuEfEQPywGFxE5tYCz_xrETUpCz5QJGHVXzgNWCOdkxhQC1_94SwP5NG1oso0xulsqTAJrYmi8cUD-K4QHuhC0jjHkX1kbN60tK9xBZbtiVHJ93yWW5u8H3sV85qcbn5-soUNiRNTMVyq3PJOdHuuuOlyhpx5e-WMQFRBOiqUNgXAgfk99fgGXc6-LkBkVsFcFY_YUNMUW3VU-H7m1uVwIU6mDYckhIG64kxv-00VnOsXTzGs-b2IbRs2J9PuxiZ5Wxz2mxXMSmYrmlRmIpqLJIg=w1691-h951-no" alt="" />
        </CardMedia>
        <Connect
            disabled={false}
            onSubmit={addNew}
            onSubmitFail={onSubmitFail}
        />
        <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </CardText>
    </Card>
)

Home.propTypes = {
    addNew: PropTypes.func.isRequired,
    onSubmitFail: PropTypes.func.isRequired,
    uid: PropTypes.string
}

export default enhance(Home)
