import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Subheader from 'material-ui/Subheader'
import { NEW_TODO_FORM_NAME } from 'constants'
import { required } from 'utils/form'
import classes from './NewTodoPanel.scss'

const NewTodoPanel = ({ submitting, handleSubmit, handleChange, disabled }) => (
  <Paper className={classes.container}>
    <Subheader>New Todo</Subheader>
    <TextField
      id="text-field-default"
      defaultValue="Default Value"
      onChange={handleChange}
    /><br />      
      <IconButton
        type="submit"
        disabled={submitting}
        onClick={handleSubmit}
        tooltipPosition="top-center"
        tooltip={disabled ? 'Login To Add Todo' : 'Add Todo'}>
        <ContentAdd />
      </IconButton>
  </Paper>
)

NewTodoPanel.propTypes = {
  handleSubmit: PropTypes.func,
  disabled: PropTypes.bool,
  submitting: PropTypes.bool
}

export default reduxForm({
  form: NEW_TODO_FORM_NAME
})(NewTodoPanel)
