import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { firebaseConnect, populate } from 'react-redux-firebase'
import Theme from 'theme'
import Grid from '../../componets/Grid/Grid.js';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import classes from './Songs.scss'
import ContentAdd from 'material-ui/svg-icons/content/send';
import { success, info, error } from 'react-notification-system-redux';
import SearchBar from 'material-ui-search-bar';
import {push} from 'react-router-redux'
import { spinnerWhileLoading } from 'utils/components'
import { compose } from 'redux'
import Immutable from 'immutable';


const populates = [{ child: 'createdBy', root: 'users' }]
const mapDispatchToProps = (dispatch)=> {
	return({
		changeLocation: (loc) => dispatch(push(loc)),
		sendError: (errorObj) => dispatch(error(errorObj)),
		sendInfo: (infoObj) => dispatch(info(infoObj)),
	})
}
const fixedbutton = {
	position: 'fixed',
	bottom: '50px',
	right: '50px', 
	size: '400px'
}
@connect(
	( {}, { params: { name }}) => ({
		projectname: name,
	})
)
@firebaseConnect(({projectname}) => [
	{ path: `projects/${projectname}` }
])
@compose(
	spinnerWhileLoading(['projectname']) // handle loading data
)
@connect(
	({ firebase, firebase: { auth, data, profile } }, { projectname }) => ({
		auth,
		profile,
		project: data.projects && data.projects[projectname]
	}),mapDispatchToProps
)
@compose(
	spinnerWhileLoading(['project']) // handle loading data
)
export default class Songs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input : '',
			items: [],
			songs: Immutable.List([]),
			}
		}

	static propTypes = {
		children: PropTypes.object,
		firebase: PropTypes.object.isRequired,
		auth: PropTypes.object
		}

	onChange = data => {
		this.setState({songs: Immutable.List(), input: data});
		}

	onTouchTap = song => {
		let { songs } = this.state;
		const userIn = Immutable.fromJS(song);
		const includes = songs.find( song => song.get('uri') === userIn.get('uri'))
		if(includes){
			songs = songs.filter( (song) => { return song.get('uri') !== userIn.get('uri')});
			this.setState({songs: songs});
			} else {
				songs = songs.push(userIn);
				this.setState({songs: songs});
				}
		}

	submitSongs = async props => {
		const {projectname} = this.props;
		const {sendError,changeLocation, project, auth, profile, firebase,sendInfo} = this.props;
		let {songs} = this.state;
				
			songs = songs.map( song => {
				return song.set("project",{ 
					name: projectname,
					votedUpBy: '',
					votedDownBy: '',
					votes: 1,
					submitedBy: auth.uid,
					author: profile.displayName || "Anonymous"
					})
				});
			const body = {
				songs : songs.toJS(),
				name: projectname,
				device: project.device,
				access_token: project.access_token, 
				refresh_token: project.refresh_token, 
				}
			fetch("/song-queue",{
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
					},
				method: "POST",
				body: JSON.stringify(body) 
				})
			.then( res =>{ return res.status })
			.then( val => { 
				if(val == 200) {
					const notificationOpts = {
						title: 'Songs Added to Queue',
						message: 'Vote it up to play next',
						position: 'tr',
						};
					sendInfo(notificationOpts)
					}
				})
			.catch( err => {
				this.props.dispatch(error({
					title: 'Error',
					message: 'Try again',
					position: 'tr',
					}))
				} )
			changeLocation(`Host/Party/${projectname}`) 
				const notificationOpts = {
					title: 'Add Songs First',
					message: 'Submit Queue Empty',
					position: 'tr',
					};
				sendError(notificationOpts)
		}

	addNew = async e =>{
		const { projectname, project, sendError, sendInfo} = this.props;
		const {input} = this.state;
		const body = {
			search: input, 
			access_token: project.access_token, 
			refresh_token: project.refresh_token, 
			name: projectname}
		fetch("/search",{
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
				},
			method: "POST",
			body: JSON.stringify(body) 
			})
		.then(data => {return data.json()})
		.then(text => {
			if(text.tracks.items.length === 0){
				const notificationOpts = {
					title: 'Search Had No Results',
					message: 'Try another search',
					position: 'tr',
					};
				sendError(notificationOpts)
				}
			else {
				const notificationOpts = {
					title: 'Search Success',
					message: 'Results',
					position: 'tr',
					};
				sendInfo(notificationOpts)
					this.setState({items: text.tracks.items});
				}}
			)
		.catch((error => { console.log(error) }));
		}

	onSubmitFail = (formErrs, dispatch, err) => {
		props.showError(formErrs ? 'Form Invalid' : err.message || 'Error')
		} 

	render() {
		const { uid, addNew, onSubmitFail } = this.props 
		const { songs } = this.state;
		return (
			<div className={classes.container} style={{ color: Theme.palette.primary2Color }}>
				<SearchBar
					onChange={this.onChange}
					onRequestSearch={this.addNew}
					style={{
						margin: '30 auto',
						width: '60%',
						height: '100%'
						}}
					/>
					<br/>
					<Grid
						tilesData = {this.state.items}
						handleTouchTap = { this.onTouchTap }
					/>
					{ songs.size > 0&&
					<FloatingActionButton 
						style={fixedbutton}
						secondary={true}
						onClick={this.submitSongs} >
						<ContentAdd />
					</FloatingActionButton>
							}
						</div>
			)
		}
}
