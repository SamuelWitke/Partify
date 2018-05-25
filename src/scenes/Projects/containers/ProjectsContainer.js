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
import { cookiesGet } from 'redux-cookies';

const mapDispatchToProps = (dispatch)=> {
	return({
		changeLocation: (loc) => dispatch(push(loc)),
		sendError: (errorObj) => dispatch(error(errorObj)),
		getSpotifyCookie: ()  => dispatch(cookiesGet('spotify'))
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
		const { getSpotifyCookie, sendError, firebase, auth, projects, dispatch, spotifyReducer} = this.props
		const json = getSpotifyCookie();		
		const str  = json.substring(2);
    const jsonData   = JSON.parse(str);
		console.log(jsonData);
		const body = {
			name: jsonData.me.uid,
			access_token: jsonData.accessToken, 
			refresh_token: jsonData.refreshToken, 
		}
		const response = await fetch('/devices',{
			headers: {
				'Accept': 'application/json, text/plain, ',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify(body)  
		});
		const data = await response.json();
		if(data.devices != undefined){
			this.setState({devices: data.devices, loading: false})
		}else if(data.msg){
			sendError({
				title: 'Error',
				message: data.msg,
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
	}

	componentWillMount(){
		this.fetchDevices();
		/*
    const { firebase } = this.props;
    firebase.setListener('projects')
		*/
	}
/*
	componentWillUnmount() {
		const { firebase } = this.props;
		firebase.unsetListener('projects')
		}
		*/


	state = {
		newProjectModal: false,
		loading: true,
		devices : [],
	}

	newSubmit = async newProject => {
		const {firebase,auth,sendError} = this.props;

		if(newProject.device == undefined){
			sendError({
				title: 'Error',
				message: 'Device not selected',
				position: 'tr',
			});
			throw new Error("Device not found")
		}

		newProject['createdBy'] = auth.email;
		/*
		const accessRef = firebase.database().ref(`users/${auth.uid}/accessToken`);
		const refreshToken = firebase.database().ref(`users/${auth.uid}/refreshToken`);
		const snapshotAccess = await accessRef.once('value');
		const snapshotRefresh = await refreshToken.once('value');

		newProject['access_token'] = snapshotAccess.val();
		newProject['refresh_token'] = snapshotRefresh.val();
		*/

		firebase
			.set(`projects/${newProject.name}`,newProject)
			.then(() => this.setState({ newProjectModal: false }))
			.catch(err => {
				console.error('error creating new project', err) // eslint-disable-line
			})
		await firebase.set(`kues/${newProject.name}`,newProject.name);
	}

	deleteProject = key => {
		const { firebase } = this.props;
		firebase.remove(`projects/${key}`)
		firebase.remove(`kues/${key}`)
	}

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
		const { projects, auth, changeLocation, spotifyReducer} = this.props
		const { newProjectModal, devices, loading } = this.state
		if (loading) {
			return <LoadingSpinner />
		}
		if(devices.length === 0) {
			return (
				<div className={classes.container}>
					<h1> Open Spotify and Connect Some Devices </h1>        
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
					{ projects && !isEmpty(projects) && 
					map(projects, (project, key) => (
						<div key={key}>
							{ auth.email === project.createdBy &&   
							<ProjectTile
								key={`${key}-Collab-${key}`}
								project={project}
								onCollabClick={this.collabClick}
								onDelete={() => this.deleteProject(key)}
								hostSelect={ () => changeLocation(`/Host/Party/${key}`) }
								onSelect={() => changeLocation(`${LIST_PATH}/${key} `)}
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
