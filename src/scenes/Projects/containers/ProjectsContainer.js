import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import { map, get } from 'lodash'
import { connect } from 'react-redux'
import {
    firebaseConnect,
    populate,
    isLoaded,
    isEmpty
} from 'react-redux-firebase'
import { LIST_PATH } from 'constants'
import { UserIsAuthenticated } from 'utils/router'
import LoadingSpinner from 'components/LoadingSpinner'
import ProjectTile from '../components/ProjectTile'
import NewProjectTile from '../components/NewProjectTile'
import NewProjectDialog from '../components/NewProjectDialog'
import classes from './ProjectsContainer.scss'
import { push } from 'react-router-redux'
import { error } from 'react-notification-system-redux';

const mapDispatchToProps = (dispatch)=> {
    return({
        sendError: (errorObj) => dispatch(error(errorObj))
    })
}

const populates = [{ child: 'createdBy', root: 'users' }]

@UserIsAuthenticated
@firebaseConnect([
    { path: '/projects' }
    // 'projects#populate=owner:users' // string equivalent
])


@connect(
    ({ spotifyReducer,firebase, firebase: { auth, data: { projects } } }, { params }) => ({
        auth,
        projects: populate(firebase, 'projects', populates),
        spotifyReducer
    }),
    mapDispatchToProps,
)
export default class Projects extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    static propTypes = {
        children: PropTypes.object,
        firebase: PropTypes.object.isRequired,
        projects: PropTypes.object,
        unpopulatedProjects: PropTypes.object,
        auth: PropTypes.object
    }

    fetchUser = ()=>{
        return new Promise((resolve, reject) => {
            this.props.firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    resolve(user)
                } else {
                    reject(console.log)
                }
            })
        })
    }

    fetchDevices = async ()=>{
        const { sendError, firebase, auth, projects, dispatch, spotifyReducer} = this.props
        let user = await this.fetchUser()
        const accessRef = this.props.firebase.database().ref(`users/${user.uid}/accessToken`);
        const refreshToken = this.props.firebase.database().ref(`users/${user.uid}/refreshToken`);

        const snapshotAccess = await accessRef.once('value');
        const snapshotRefresh = await refreshToken.once('value');
        const body = {
            name: user.uid,
            access_token: snapshotAccess.val(), 
            refresh_token: snapshotRefresh.val(), 
        }
        const response = fetch('/devices',{
            headers: {
                'Accept': 'application/json, text/plain, ',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)  
        }).then( response =>{
            return response.json();
        } ).then( data =>{
            if(data.devices != undefined){
                this.setState({devices: data.devices, loading: false})
            }else if(data.msg === "no devices"){
                sendError({
                    title: 'Error',
                    message: 'No Devices Found',
                    position: 'tr',
                    autoDismiss: 0,
                    action: {
                        label: 'Try Again?',
                        callback: () => {
                            this.fetchDevices();
                        }
                    }
                })
                this.setState({loading: false})
            }
        } )
    }

    componentWillMount(){
        this.fetchDevices();
    }


    state = {
        newProjectModal: false,
        loading: true,
        devices : [],
    }

    newSubmit = async newProject => {
        const {auth,spotifyReducer,sendError} = this.props;

        if(newProject.device == undefined){
            sendError({
                title: 'Error',
                message: 'Device not selected',
                position: 'tr',
            });
            throw new Error("Device not found")
        }

        newProject['createdBy'] = auth.email;
        const accessRef = this.props.firebase.database().ref(`users/${auth.uid}/accessToken`);
        const refreshToken = this.props.firebase.database().ref(`users/${auth.uid}/refreshToken`);
        const snapshotAccess = await accessRef.once('value');
        const snapshotRefresh = await refreshToken.once('value');

        newProject['access_token'] = snapshotAccess.val();
        newProject['refresh_token'] = snapshotRefresh.val();
        return this.props.firebase
            .set(`projects/${newProject.name}`,newProject)
            .then(() => this.setState({ newProjectModal: false }))
            .catch(err => {
                console.error('error creating new project', err) // eslint-disable-line
            })
    }

    deleteProject = key => this.props.firebase.remove(`projects/${key}`)

    toggleModal = (name, project) => {
        let newState = {}
        newState[`${name}Modal`] = !this.state[`${name}Modal`]
        this.setState(newState)
    }

    getDeleteVisible = key => {
        const { auth, projects, dispatch } = this.props

        return (
            !isEmpty(this.props.auth) && projects[key].createdBy === auth.email
        )
    }

    render() {
        const { projects, auth, dispatch, spotifyReducer} = this.props
        const { newProjectModal, devices, loading } = this.state
        if (loading || !isLoaded(projects,auth)) {
            return <LoadingSpinner />
        }
        if(devices.length === 0) {
            return (
                <div className={classes.container}>
                    <h1> Open Spotify and Connect Some Devices </h1>        
                    <LoadingSpinner />
                </div>
            )
        }
        if (this.props.children) {
            return cloneElement(this.props.children, this.props)
        }
        return (
            <div className={classes.container}>
                {newProjectModal && (
                    <NewProjectDialog
                        devices = {this.state.devices}
                        open={newProjectModal}
                        onSubmit={this.newSubmit}
                        onRequestClose={() => this.toggleModal('newProject')}
                    />
                )}
            <div className={classes.tiles}>
                <NewProjectTile onClick={() => this.toggleModal('newProject')} />
                {!isEmpty(projects) && 
                        map(projects, (project, key) => (
                            <div>
                                { auth.email === project.createdBy &&   
                                <ProjectTile
                                    key={`${key}-Collab-${key}`}
                                    project={project}
                                    onCollabClick={this.collabClick}
                                    onDelete={() => this.deleteProject(key)}
                                    onSelect={() => dispatch(push(`${LIST_PATH}/${key} `))}
                                    showDelete={this.getDeleteVisible(key)}
                                        />
                                }
                            </div>
                    ))}
                </div>
            </div>
        )
    }
}
