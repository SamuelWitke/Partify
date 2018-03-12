import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Subheader from 'material-ui/Subheader'
import { NEW_CONNECT_CODE } from 'constants'
import { required } from 'utils/form'
import FlatButton from 'material-ui/FlatButton';


const renderTextField = (
  { input, label, meta: { touched, error }, ...custom },
) => (
  <TextField
    hintText={label}
    fullWidth={true}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
);

const Connect = ({ submitting, handleSubmit, disabled }) => (
    <form onSubmit={handleSubmit}>
      <Field
        name="code"
        component={renderTextField}
        floatingLabelText="Enter Host Code"
        validate={[required]}
      />
      <FlatButton 
        label="Submit Code" 
        backgroundColor="#ef5350"
        hoverColor="#78909C"
        fullWidth={true} 
        type="submit"
        disabled={submitting}
      />
     </form>
)

Connect.propTypes = {
  handleSubmit: PropTypes.func,
  disabled: PropTypes.bool,
  submitting: PropTypes.bool
}

export default reduxForm({
  form: NEW_CONNECT_CODE
})(Connect)
