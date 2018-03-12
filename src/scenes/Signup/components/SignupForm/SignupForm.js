import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import RaisedButton from 'material-ui/RaisedButton'
import { SIGNUP_FORM_NAME } from 'constants'
import { required, validateEmail } from 'utils/form'
import classes from './SignupForm.scss'

const renderRadioGroup = ({input, ...rest}) => (
	<RadioButtonGroup
		{...input}
		{...rest}
		valueSelected={input.value}
		onChange={(event, value) => input.onChange(value)}
	/>
	)

const SignupForm = ({ user, pristine, submitting, handleSubmit, devices }) => (
	<form className={classes.container} onSubmit={handleSubmit}>
		<Field
			name="displayName"
			component={TextField}
			floatingLabelText="Username"
			validate={required}
		/>
		<Field
			disabled={user ? true : false}
			name="email"
			component={TextField}
			floatingLabelText="Email"
			validate={[required, validateEmail]}
		/>
		<Field
			name="password"
			component={TextField}
			floatingLabelText="Password"
			type="password"
			validate={required}
		/>
		<br/>
            {/*
		<div>
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
			</div>
		   */}
	<div className={classes.submit}>
				<RaisedButton
					label="Signup"
					primary
					type="submit"
					disabled={pristine || submitting}
				/>
			</div>
         
		</form>
)

SignupForm.propTypes = {
	pristine: PropTypes.bool.isRequired, // added by redux-form
	submitting: PropTypes.bool.isRequired, // added by redux-form
	handleSubmit: PropTypes.func.isRequired // added by redux-form
}

export default reduxForm({
	form: SIGNUP_FORM_NAME
})(SignupForm)
