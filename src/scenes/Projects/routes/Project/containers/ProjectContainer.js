import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isEmpty } from 'react-redux-firebase'
import { spinnerWhileLoading } from 'utils/components'
import classes from './ProjectContainer.scss'
import Project from '../components/Project';

@firebaseConnect(({ params: { projectname } }) => [
	{ path: `projects/${projectname}` }
])
@connect(({ firebase: { data } }, { params: { projectname } }) => ({
	project: data.projects && data.projects[projectname]
}))
@compose(
	spinnerWhileLoading(['project']) // handle loading data
)
export default class ProjectContainer extends Component {
	onClick = event => {
		const {firebase,params} = this.props;
		const query = event.target.value.trim().toLowerCase()
		alert(query);	
		/*
		const data = {
			"album" : "Dark Knight Dummo (Feat. Travis Scott)",
			"downvote" : 0,
			"img" : "https://i.scdn.co/image/596984c5af902532c982aec0c20d61a060c64623",
			"name" : "Dark Knight Dummo (Feat. Travis Scott)",
			"upvote" : 0
			}
		const realData ={
			"album" : "How To Be A Human Being",
			"downvote" : 0,
			"img" : "https://i.scdn.co/image/1ad69327d5e8ee9d4347d7273ecbfb0c472f18c0",
			"name" : "The Other Side Of Paradise",
			"upvote" : 1
			}
		firebase.push(`projects/${params.projectname}/Songs`,realData);
		alert("Submitted");
			*/
		}

	render() {
		const { project, params } = this.props;
		if (isEmpty(project)) {
			return <div>ProjectContainer not found</div>
				}

		return (
		<div>
			<Project 
				projects={project} 
				params={params}
				onClick={this.onClick}
			/>
			</div>
			)
		}
}
