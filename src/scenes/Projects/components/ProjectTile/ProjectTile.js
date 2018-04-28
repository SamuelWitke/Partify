import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { isObject } from 'lodash'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import Settings from 'material-ui/svg-icons/action/settings'
import classes from './ProjectTile.scss'

const ProjectTile = ({ project, onSelect, onDelete, showDelete }) => (
  <Paper className={classes.container}>
    <div className={classes.top}>
      <span className={classes.name} onClick={() => onSelect(project)}>
        {project.name}
      </span>
      {showDelete && onDelete ? (
          <IconButton tooltip="Delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      ) : null}
      {showDelete && onDelete ? (
          <IconButton tooltip="Settings" onClick={() => onSelect(project)}>
            <Settings />
        </IconButton>
      ) : null}

    </div>
    <span className={classes.owner}>
      {isObject(project.createdBy)
        ? project.createdBy.username
        : project.createdBy || 'No Owner'}
    </span>
  </Paper>
)

ProjectTile.propTypes = {
  project: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  showDelete: PropTypes.bool
}

export default ProjectTile
