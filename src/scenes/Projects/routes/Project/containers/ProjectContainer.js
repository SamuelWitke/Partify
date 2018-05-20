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
@connect(
	( {}, { params: { projectname } }) => ({
		projectname: projectname,
	})
)
@firebaseConnect(({projectname}) => [
	{ path: `projects/${projectname}` }
])
@compose(
	spinnerWhileLoading(['projectname']) // handle loading data
)
@connect(
	({ firebase: { auth, data, profile } }, {projectname}) => ({
		profile: profile,
		uid: auth.uid,
		project: data.projects && data.projects[projectname]
	}),
	mapDispatchToProps
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
		const {firebase, profile, project, projectname} = this.props;
		const { sendInfo, sendError } = this.props;

		const user = profile.displayName;
		const body = {
			user: profile.displayName,
			name: projectname,
			access_token: project.access_token,
			refresh_token: project.refresh_token,
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
		if( val.items) {
			this.setState({items : val.items, loading: false})
			sendInfo({
				title: 'Your Playlist',
				message: 'User Playlist',
				position: 'tr',
			})
		}if(val.msg){
			this.setState({loading: true})
			sendError({
				title: 'Error',
				message: val.msg,
				position: 'tr',
				autoDismiss: 0,
				action: {
					label: 'Try Again?',
					callback: () => {
						this.getUserPlaylist();
					}
				}
			})
		}
	}

	async componentWillMount(){
		this.getUserPlaylist();
	}

	submitPlaylist = async (item) =>{
		const {changeLocation, sendSuccess, project, firebase, uid, profile, projectname} = this.props;
		const user = profile.displayName;

		const body = {
			user: profile.displayName,
			projectname, 
			id: item.id,
			device: project.device,
			submitedBy: item.name,
			access_token: project.access_token,
			refresh_token: project.refresh_token,
		}
		this.setState({loading: true})
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
				this.setState({loading: false})
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
