import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'
import { NEW_PROJECT_FORM_NAME } from 'constants'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import classes from './NewProjectDialog.scss'

const renderRadioGroup = ({input, ...rest}) => (
	<RadioButtonGroup
		{...input}
		{...rest}
		valueSelected={input.value}
		onChange={(event, value) => input.onChange(value)}
	/>
	)

export const NewProjectDialog = ({
    open,
    onRequestClose,
    submit,
    handleSubmit,
    devices
}) => (
    <Dialog
        title="New Party"
        open={open}
        onRequestClose={onRequestClose}
        contentClassName={classes.container}
        actions={[
        <FlatButton label="Cancel" secondary onTouchTap={onRequestClose} />,
        <FlatButton label="Create" primary onTouchTap={submit} />
        ]}>
        Make a host code for your guests to connect to.
        <form onSubmit={handleSubmit} className={classes.inputs}>
            <Field
                name="name"
                component={TextField}
                floatingLabelText="Host Code"
                validate={[required]}
            />
        <h2> Device To Host On </h2>
        <Field name="device" component={renderRadioGroup}>
            {devices && 
            devices.map( elm =>	 {
                return (
                    <RadioButton 
                        label={elm.name} 
                        value={elm.id} 
                        name='device' />
                    );
                })}			
            </Field>
        </form>
    </Dialog>
)

NewProjectDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    handleSubmit: PropTypes.func.isRequired, // added by redux-form
    submit: PropTypes.func.isRequired // added by redux-form
}

export default reduxForm({
    form: NEW_PROJECT_FORM_NAME
})(NewProjectDialog)
