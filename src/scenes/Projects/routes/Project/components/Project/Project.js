import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classes from './Project.scss'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export const Project = ({ projects, params: { projectname }, onClick }) => (
	<div>
		<div className={classes.container}>
			{projects.name ? (
				<div>
					<h2>Project Container</h2>
					<h3>{JSON.stringify(projects.name, null, 2)}</h3>
				</div>
				) : (
					<div className={classes.empty}>
						<span>Project Not Found</span>
					</div>
					)}
				</div>
	</div>
)

Project.propTypes = {
	projects: PropTypes.object,
	params: PropTypes.object.isRequired
}

export default Project
