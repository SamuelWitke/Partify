import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty } from 'react-redux-firebase'
import { spinnerWhileLoading } from 'utils/components'
import classes from './ProjectContainer.scss'
import Project from '../components/Project';
import LoadingSpinner from 'components/LoadingSpinner'
import { success, error, warning, info, removeAll } from 'react-notification-system-redux';
import Grid from '../components/Grid/Grid.js'
import {push} from 'react-router-redux'

const mapDispatchToProps = (dispatch)=> {
    return({
        changeLocation: (loc) => dispatch(push(loc)),
        sendError: (errorObj) => dispatch(error(errorObj)),
        sendInfo: (infoObj) => dispatch(info(infoObj)),
        sendSuccess: (successObj) => dispatch(success(successObj)),
    })
}

@firebaseConnect(({ params: { projectname } }) => [
    { path: `projects/${projectname}` }
])
@connect(
    ({ firebase: { auth, data, profile } }, { params: { projectname } }) => ({
        projectname: projectname,
        profile: profile,
        uid: auth.uid,
        project: data.projects && data.projects[projectname]
    }),mapDispatchToProps
)
@compose(
    spinnerWhileLoading(['project']) // handle loading data
)
export default class ProjectContainer extends Component {
    state = {
        items: [],
        loading: true,
    }
    
    getUserPlaylist = async () => {
        const {firebase, profile, projectname} = this.props;

        const user = profile.displayName;
        const accessRef = firebase.database().ref(`projects/${projectname}/access_token`);
        const refreshRef = firebase.database().ref(`projects/${projectname}/refresh_token`);
        const snapshotAccess = await accessRef.once('value');
        const snapshotRefresh = await refreshRef.once('value');

        const body = {
            user: profile.displayName,
            name: projectname,
            access_token: snapshotAccess.val(),
            refresh_token: snapshotRefresh.val(),
        }
        const res = await(fetch("/user-playlist",{
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
        }))
        const val = await res.json()
        return val;
    }

    async componentWillMount(){
        const { sendInfo, sendError } = this.props;
        const val = await this.getUserPlaylist();
       if( val !== "Invalid access token" ) {
            this.setState({items : val.items, loading: false})
            sendInfo({
            title: 'Your Playlist',
            message: 'User Playlist',
            position: 'tr',
            })
       }else{
             sendError({
                title: 'Error',
                message: 'Invalid access token',
                position: 'tr',
                autoDismiss: 0,
                action: {
                    label: 'Try Again?',
                    callback: () => {
                        this.getUserPlaylist();
                    }
                }
            })
            this.setState({loading: false})

       }
    }

    submitPlaylist = async (item) =>{
        const {changeLocation, sendSuccess, firebase, uid, profile, projectname} = this.props;
        const user = profile.displayName;
        const accessRef = firebase.database().ref(`projects/${projectname}/access_token`);
        const refreshRef = firebase.database().ref(`projects/${projectname}/refresh_token`);
        const deviceRef = firebase.database().ref(`projects/${projectname}/device`);
        const snapshotAccess = await accessRef.once('value');
        const snapshotRefresh = await refreshRef.once('value');
        const device = await deviceRef.once('value');
        const body = {
            user: profile.displayName,
            projectname, 
            id: item.id,
            device: device.val(),
            submitedBy: item.name,
            access_token: snapshotAccess.val(),
            refresh_token: snapshotRefresh.val(),
        }
        fetch("/submit-playlist",{
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
        }).then( res =>{ return res.status})
            .then( val => {
                changeLocation(`/Host/Party/${projectname}`)
                sendSuccess({
                    title: 'Playlist Added To The Queue',
                    message: 'Start Hosting',
                    position: 'tr',
                })
            })
    }

    render() {
        const { project, params} = this.props;
        const { loading, items } = this.state;

        if (isEmpty(project)) {
            return <div>ProjectContainer not found</div>
        }

        if (loading) {
            return <LoadingSpinner />
        }

        return (
            <div>
                <Project 
                    projects={project} 
                    params={params}
                    onClick={this.onClick}
                />
                { items && 
                <Grid 
                    handleTouchTap={this.submitPlaylist}
                    items = {items}
                />
                }
            </div>
        )
    }
}
