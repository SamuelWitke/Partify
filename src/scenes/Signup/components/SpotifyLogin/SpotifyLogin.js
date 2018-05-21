import React from 'react';
import PropTypes from 'prop-types';
import loginSVG from './log_in.svg';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
		backgroundColor: '#1e3264',
		borderRadius: 20,
  },
});

const SpotifyLogin= ({classes}) => (
<div className={classes.root}>
	<Grid container spacing={24}>
		<Grid item xs={12}>
		 <Paper className={classes.paper} zDepth={5}>
			<a href="/auth/oauth" >
				<img src={loginSVG} />
			</a>                              
			</Paper>
		</Grid>
		<Grid item xs={12}>
			<h2>Login Based On OAuth</h2>                                                                 
			<img style={{maxWidth: '100%', maxHeight: '100%'}} src={"https://beta.developer.spotify.com/assets/AuthG_AuthoriztionCode.png"} />
		</Grid>
	</Grid>
	</div>
)
export default withStyles(styles)(SpotifyLogin);
